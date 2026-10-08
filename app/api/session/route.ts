import { NextResponse } from "next/server";
import type { ISessionResponse } from "@/entities/session/model/types";
import { createSessionSchema } from "@/features/create-session/model/schema";
import type { ISessionPayload } from "@/features/create-session/model/types";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";

export async function POST(request: Request) {
  try {
    const session = await getSessionPayload();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as ISessionPayload;

    const parsed = createSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
        },
        { status: 422 },
      );
    }

    const { testId, mode, chunkIndex } = parsed.data;

    const { data, error } = await supabaseAdmin.rpc("create_test_session", {
      p_test_id: testId,
      p_user_id: session.userId,
      p_mode: mode,
      p_chunk_index: chunkIndex,
    });

    if (error) {
      console.error("create_test_session:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      if (error.message === "Test not found") {
        return NextResponse.json({ error: "Test not found" }, { status: 404 });
      }

      if (error.message === "Chunk does not exist") {
        return NextResponse.json({ error: "Chunk does not exist" }, { status: 400 });
      }

      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(data as ISessionResponse);
  } catch (error) {
    console.error("POST /api/session:", error);

    return NextResponse.json({ error: "Failed to create test session" }, { status: 500 });
  }
}
