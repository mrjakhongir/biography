import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id: testId } = await params;

    const session = await getSessionPayload();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin.rpc("get_test_chunks", {
      p_test_id: testId,
      p_user_id: session.userId,
    });

    if (error) {
      console.error("get_test_chunks error:", error);

      if (error.message === "Test not found") {
        return NextResponse.json({ error: "Test not found" }, { status: 404 });
      }

      return NextResponse.json({ error: "Failed to get test chunks" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/test/[id]/chunks error:", error);

    return NextResponse.json({ error: "Failed to get test chunks" }, { status: 500 });
  }
}
