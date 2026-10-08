import { NextResponse } from "next/server";
import { z } from "zod";
import type { IQuestionDTO } from "@/entities/question";
import type { ITestDTO } from "@/entities/test";
import { mapTest, mapTestPreview } from "@/entities/test/lib/map-test";
import { testSelectWithRelations } from "@/entities/test/model/constants";
import { updateTestFormSchema } from "@/features/update-test/model/schema";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";

const parametersSchema = z.object({
  id: z.uuidv4(),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  const session = await getSessionPayload();

  if (!session) {
    return NextResponse.json({ error: "Avtorizatsiyadan o'ting." }, { status: 401 });
  }

  const parameters = await context.params;
  const parsed = parametersSchema.safeParse(parameters);

  if (!parsed.success) {
    return NextResponse.json({ error: "Xato test ma'lumoti." }, { status: 422 });
  }

  const { data, error } = await supabaseAdmin
    .from("tests")
    .delete()
    .eq("id", parsed.data.id)
    .eq("creator_id", session.userId)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Test topilmadi." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    id: data.id,
  });
}

const routeParametersSchema = z.object({
  id: z.uuid(),
});

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getSessionPayload();

  if (!session) {
    return NextResponse.json({ error: "Avtorizatsiyadan o'ting." }, { status: 401 });
  }

  const parsedParameters = routeParametersSchema.safeParse(await context.params);

  if (!parsedParameters.success) {
    return NextResponse.json({ error: "Test ID xato." }, { status: 422 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Xato test ma'lumoti." }, { status: 400 });
  }

  const parsedBody = updateTestFormSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "Xato test ma'lumoti.",
        fields: z.treeifyError(parsedBody.error),
      },
      { status: 422 },
    );
  }

  const { id } = parsedParameters.data;
  const values = parsedBody.data;
  const date = new Date();

  const { data, error } = await supabaseAdmin
    .from("tests")
    .update({
      title: values.title,
      subject: values.subject,
      price_stars: values.priceStars,
      in_sale: values.inSale,
      updated_at: date.toISOString(),
    })
    .eq("id", id)
    .eq("creator_id", session.userId)
    .select(testSelectWithRelations)
    .maybeSingle()
    .overrideTypes<ITestDTO, { merge: false }>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Test topilmadi." }, { status: 404 });
  }

  return NextResponse.json({
    test: mapTest(data),
  });
}

export async function GET(_: Request, context: RouteContext) {
  const parameters = await context.params;

  const parsed = routeParametersSchema.safeParse(parameters);

  if (!parsed.success) {
    return NextResponse.json({ error: "Test ID xato." }, { status: 422 });
  }
  const { data, error } = await supabaseAdmin
    .from("tests")
    .select(`
      ${testSelectWithRelations},
      questions (
        id,
        question,
        options (
          id,
          option,
          is_correct
        )
      )
    `)
    .eq("id", parsed.data.id)
    .order("created_at", {
      referencedTable: "questions",
      ascending: true,
    })
    .limit(5, {
      referencedTable: "questions",
    })
    .maybeSingle()
    .overrideTypes<
      ITestDTO & {
        questions: IQuestionDTO[];
      },
      { merge: false }
    >();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Test topilmadi." }, { status: 404 });
  }

  return NextResponse.json(mapTestPreview(data));
}
