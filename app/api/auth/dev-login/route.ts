import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { createSessionToken, setSessionCookie } from "@/shared/lib/telegram/session";

export async function POST(request: Request) {
  if (process.env.AUTH_MOCK_ENABLED !== "true") {
    return NextResponse.json({ error: "Dev login is disabled." }, { status: 403 });
  }

  const telegramId = Number(process.env.MOCK_TELEGRAM_ID ?? 777_000);

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .upsert(
      {
        telegram_id: telegramId,
        first_name: process.env.MOCK_FIRST_NAME ?? "Dev",
        last_name: process.env.MOCK_LAST_NAME,
        username: process.env.MOCK_USERNAME ?? "dev_user",
      },
      {
        onConflict: "telegram_id",
      },
    )
    .select("id, telegram_id")
    .single();

  if (error) {
    return NextResponse.json(
      {
        step: "user_upsert",
        error: error.message,
      },
      { status: 500 },
    );
  }

  const sessionToken = await createSessionToken({
    userId: user.id,
    telegramId: user.telegram_id,
  });

  const response = NextResponse.json({
    ok: true,
    user,
  });

  setSessionCookie({
    request,
    response,
    token: sessionToken,
  });

  return response;
}
