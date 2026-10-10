import type { InfoFormValues } from "@/features/create-info/model/schema";
import { formatPersonalInfoMessage } from "./format-personal-info-message";

export async function sendPersonalInfoMessage(chatId: string | number, values: InfoFormValues): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatPersonalInfoMessage(values),
      parse_mode: "HTML",
    }),
  });

  const result = (await response.json().catch(() => null)) as {
    ok?: boolean;
    description?: string;
    error_code?: number;
  } | null;

  if (!response.ok || !result?.ok) {
    throw new Error(
      `Telegram API error (${result?.error_code ?? response.status}): ${result?.description ?? "Unknown error"}`,
    );
  }
}
