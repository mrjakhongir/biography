import { type NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";

interface RouteContext {
  params: Promise<{
    sessionId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  console.log(request);
  try {
    const session = await getSessionPayload();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { sessionId } = await params;

    const { data, error } = await supabaseAdmin.rpc("get_session_questions", {
      p_session_id: sessionId,
      p_user_id: session.userId,
    });

    if (error) {
      console.error("get_session_questions RPC error:", error);

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

    if (!data) {
      return NextResponse.json({ error: "Session questions not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get session questions error:", error);

    return NextResponse.json({ error: "Failed to get playground questions" }, { status: 500 });
  }
}
