import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";

interface RouteContext {
  params: Promise<{
    sessionId: string;
  }>;
}

export async function POST(request: Request, { params }: RouteContext) {
  console.log(request);
  try {
    const session = await getSessionPayload();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.rpc("finish_test_session", {
      p_session_id: sessionId,
      p_user_id: session.userId,
    });

    if (error) {
      console.error("finish_test_session error:", error);

      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Finish test session error:", error);

    return NextResponse.json({ error: "Failed to finish test session" }, { status: 500 });
  }
}
