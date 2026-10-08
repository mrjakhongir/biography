import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";

const answerSchema = z.object({
  questionId: z.uuid(),
  optionId: z.uuid(),
  isCorrect: z.boolean(),
});

type Props = {
  params: Promise<{
    sessionId: string;
  }>;
};

export async function POST(request: Request, { params }: Props) {
  try {
    const { sessionId } = await params;

    const session = await getSessionPayload();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = answerSchema.parse(await request.json());

    const { data, error } = await supabaseAdmin.rpc("save_session_answer", {
      p_session_id: sessionId,
      p_user_id: session.userId,
      p_question_id: body.questionId,
      p_option_id: body.optionId,
      p_is_correct: body.isCorrect,
    });

    if (error) {
      console.error("save_session_answer error:", error);

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    console.error("Save session answer error:", error);

    return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
  }
}
