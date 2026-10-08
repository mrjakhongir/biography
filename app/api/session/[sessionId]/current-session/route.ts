import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";

type RouteContext = {
  params: Promise<{
    sessionId: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const session = await getSessionPayload();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { sessionId } = await params;
    if (!sessionId) return NextResponse.json({ error: "Session ID is required" }, { status: 400 });

    const { data: sessionData, error } = await supabaseAdmin
      .from("test_sessions")
      .select(`
        id,
        test_id,
        mode,
        chunk_index,
        question_index,
        total_questions
      `)
      .eq("id", sessionId)
      .eq("user_id", session.userId)
      .single();

    if (error || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: sessionData.id,
      testId: sessionData.test_id,
      mode: sessionData.mode,
      chunkIndex: sessionData.chunk_index,
      questionIndex: sessionData.question_index,
      totalQuestions: sessionData.total_questions,
    });
  } catch (error) {
    console.error("Get test session error:", error);

    return NextResponse.json({ error: "Failed to get test session" }, { status: 500 });
  }
}
