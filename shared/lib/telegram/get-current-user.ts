import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { IUserDTO } from "@/entities/user/model/types";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { SESSION_COOKIE } from "./session";

export async function getCurrentUser(): Promise<IUserDTO | undefined> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  if (!session) return;

  try {
    const { payload } = await jwtVerify(session, getJwtSecret());
    const sessionPayload = payload as unknown as SessionPayload;

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", sessionPayload.userId)
      .eq("telegram_id", sessionPayload.telegramId)
      .single();

    if (error) return;

    return data;
  } catch {
    return;
  }
}

function getJwtSecret() {
  const secret = process.env.APP_SESSION_SECRET;

  if (!secret) {
    throw new Error("APP_SESSION_SECRET is not configured.");
  }

  const encoder = new TextEncoder();
  return encoder.encode(secret);
}

type SessionPayload = {
  userId: string;
  telegramId: number;
};

// get user from cookie
export async function getSessionPayload(): Promise<SessionPayload | undefined> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  if (!session) return;

  try {
    const { payload } = await jwtVerify(session, getJwtSecret());

    return payload as unknown as SessionPayload;
  } catch {
    return;
  }
}
