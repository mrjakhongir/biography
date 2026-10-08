import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";

type Props = {
  params: Promise<{
    sessionId: string;
  }>;
};

export async function POST(_: Request, { params }: Props) {
  try {
    const { sessionId } = await params;

    const session = await getSessionPayload();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current session
    const { data: currentSession, error: sessionError } = await supabaseAdmin
      .from("test_sessions")
      .select("id, user_id, question_index")
      .eq("id", sessionId)
      .eq("user_id", session.userId)
      .single();

    if (sessionError || !currentSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Find next question
    const { data: nextQuestion, error: questionError } = await supabaseAdmin
      .from("test_session_questions")
      .select("question_index")
      .eq("session_id", sessionId)
      .eq("question_index", currentSession.question_index + 1)
      .maybeSingle();

    if (questionError) {
      console.error("Find next question error:", questionError);

      return NextResponse.json({ error: questionError.message }, { status: 400 });
    }

    // No next question = session is finished
    if (!nextQuestion) {
      return NextResponse.json({
        sessionId,
        questionIndex: currentSession.question_index,
        hasNext: false,
        isFinished: true,
      });
    }

    // Advance session
    const { data: updatedSession, error: updateError } = await supabaseAdmin
      .from("test_sessions")
      .update({
        question_index: nextQuestion.question_index,
      })
      .eq("id", sessionId)
      .eq("user_id", session.userId)
      .select("id, question_index")
      .single();

    if (updateError) {
      console.error("Advance session error:", updateError);

      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({
      sessionId: updatedSession.id,
      questionIndex: updatedSession.question_index,
      hasNext: true,
      isFinished: false,
    });
  } catch (error) {
    console.error("Advance session error:", error);

    return NextResponse.json({ error: "Failed to advance session" }, { status: 500 });
  }
}
