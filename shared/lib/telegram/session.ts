import { SignJWT } from "jose";
import type { NextResponse } from "next/server";

export const SESSION_COOKIE = "app_session";

function getJwtSecret() {
  const secret = process.env.APP_SESSION_SECRET;

  if (!secret) {
    throw new Error("APP_SESSION_SECRET is not configured.");
  }
  const encoder = new TextEncoder();
  return encoder.encode(secret);
}

type CreateSessionTokenParameters = {
  userId: string;
  telegramId: number;
};

export function createSessionToken({ userId, telegramId }: CreateSessionTokenParameters) {
  const jwt = new SignJWT({
    userId,
    telegramId,
  });

  return jwt.setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(getJwtSecret());
}

export function setSessionCookie({
  request,
  response,
  token,
}: {
  request: Request;
  response: NextResponse;
  token: string;
}) {
  const requestUrl = new URL(request.url);
  const forwardedProto = request.headers.get("x-forwarded-proto");

  const isHttps = requestUrl.protocol === "https:" || forwardedProto === "https";

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 6,
  });
}
