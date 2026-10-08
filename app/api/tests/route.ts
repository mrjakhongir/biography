import { type NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import z from "zod";
import { mapTest } from "@/entities/test/lib/map-test";
import { testSelectPurchased, testSelectWithRelations } from "@/entities/test/model/constants";
import type { ITestDTO } from "@/entities/test/model/types";
import { createTestFormSchema, excelRowSchema } from "@/features/create-test/model/schema";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";
import { SCOPE } from "@/shared/types/types";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  // auth user
  const session = await getSessionPayload();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  // get query
  const searchParameters = request.nextUrl.searchParams;
  const pageIndex = Number(searchParameters.get("pageIndex") ?? 0);
  const scope = searchParameters.get("scope");

  // pagination
  const from = Number(pageIndex) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const isPurchased = scope === SCOPE.PURCHASED;

  const select = isPurchased ? testSelectPurchased : testSelectWithRelations;

  let query = supabaseAdmin.from("tests").select(select, {
    count: "exact",
  });

  if (scope === SCOPE.PURCHASED) {
    query = query.eq("purchases.user_id", session.userId);
  } else if (scope === SCOPE.AUTHOR) {
    query = query.eq("creator_id", session.userId);
  } else if (scope === SCOPE.ALL) {
    query = query.neq("creator_id", session.userId).eq("in_sale", true);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)
    .overrideTypes<ITestDTO[], { merge: false }>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: (data ?? []).map((item) => mapTest(item)),
    count: count ?? 0,
    pageIndex,
    pageSize: PAGE_SIZE,
  });
}

// create test

type ParsedQuestion = {
  index: number;
  question: string;
  options: {
    option: string;
    isCorrect: boolean;
  }[];
};
export async function POST(request: Request) {
  const session = await getSessionPayload();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Excel file is required." }, { status: 422 });
  }

  const body = {
    title: formData.get("title"),
    subject: formData.get("subject"),
    semester: formData.get("semester"),
    priceStars: Number(formData.get("priceStars")),
    file,
  };

  const parsed = createTestFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid test data.",
        fields: z.treeifyError(parsed.error),
      },
      { status: 422 },
    );
  }

  const values = parsed.data;

  // Parse Excel
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
  });

  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    return NextResponse.json({ error: "Excel file does not contain a worksheet." }, { status: 422 });
  }

  const worksheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<unknown>(worksheet, {
    defval: "",
  });

  if (rows.length === 0) {
    return NextResponse.json({ error: "Excel file contains no questions." }, { status: 422 });
  }

  // Validate + transform Excel

  const questions: ParsedQuestion[] = [];

  for (const [index, row] of rows.entries()) {
    const result = excelRowSchema.safeParse(row);

    if (!result.success) {
      return NextResponse.json(
        {
          error: `Invalid question at row ${index + 2}.`,
          fields: z.treeifyError(result.error),
        },
        { status: 422 },
      );
    }

    const data = result.data;

    questions.push({
      index,
      question: data.question,
      options: [
        {
          option: data.correct,
          isCorrect: true,
        },
        {
          option: data.option_2,
          isCorrect: false,
        },
        {
          option: data.option_3,
          isCorrect: false,
        },
        {
          option: data.option_4,
          isCorrect: false,
        },
      ],
    });
  }

  // Create test

  const { data: testId, error } = await supabaseAdmin.rpc("create_test_with_questions", {
    p_creator_id: session.userId,
    p_title: values.title,
    p_subject: values.subject,
    p_price_stars: values.priceStars,
    p_questions: questions,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      testId,
      totalQuestions: questions.length,
    },
    { status: 201 },
  );
}
