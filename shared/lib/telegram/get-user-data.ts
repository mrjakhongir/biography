import { validateInitData } from "./validate";

export type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

export function getUserData(initData: string): TelegramUser {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  }

  if (!validateInitData(initData, token)) {
    throw new Error("Telegram initData is invalid.");
  }

  const parameters = new URLSearchParams(initData);

  const authDate = Number(parameters.get("auth_date"));

  if (Date.now() / 1000 - authDate > 60 * 60) {
    throw new Error("Telegram initData has expired.");
  }

  const user = parameters.get("user");

  if (!user) {
    throw new Error("Telegram user is missing.");
  }

  return JSON.parse(user) as TelegramUser;
}
