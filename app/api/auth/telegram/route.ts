import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getUserData } from "@/shared/lib/telegram/get-user-data";
import { createSessionToken, setSessionCookie } from "@/shared/lib/telegram/session";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      initData?: string;
    };

    if (!body.initData) {
      return NextResponse.json({ error: "initData is required." }, { status: 400 });
    }

    const telegramUser = getUserData(body.initData);

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .upsert(
        {
          telegram_id: telegramUser.id,
          first_name: telegramUser.first_name,
          username: telegramUser.username,
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
  } catch (error) {
    return NextResponse.json(
      {
        step: "telegram_auth",
        error: error instanceof Error ? error.message : "Telegram authentication failed.",
      },
      { status: 401 },
    );
  }
}
