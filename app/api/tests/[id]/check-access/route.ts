import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: Request, { params }: Props) {
  const { id: testId } = await params;

  const session = await getSessionPayload();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin.rpc("has_test_access", {
    p_test_id: testId,
    p_user_id: session.userId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
