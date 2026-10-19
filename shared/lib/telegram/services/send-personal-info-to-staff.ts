import "server-only";

import type { InfoFormValues } from "@/features/create-info/model/schema";
import { createBot } from "@/shared/lib/telegram/bot";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendPersonalInfoToStaff(values: InfoFormValues, docBuffer: Buffer, username?: string | null) {
  const chatId = process.env.TELEGRAM_STAFF_GROUP_ID;

  if (!chatId) {
    throw new Error("TELEGRAM_STAFF_GROUP_ID is not configured");
  }

  const bot = createBot();

  const fullName = escapeHtml(values.fullname.trim());
  const faculty = escapeHtml(values.faculty.trim());
  const group = escapeHtml(values.group.trim());
  const phone = escapeHtml(values.studentPhone.trim());
  const telegramUsername = username?.trim() ? `@${escapeHtml(username.replace(/^@/, ""))}` : "Mavjud emas";

  const caption = [
    `<b>F.I.Sh.:</b> ${fullName}`,
    `<b>Fakultet:</b> ${faculty}`,
    `<b>Guruh:</b> ${group}`,
    `<b>Telefon:</b> ${phone}`,
    `<b>Telegram:</b> ${telegramUsername}`,
  ].join("\n");

  const filename = `${
    values.fullname
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^\p{L}\p{N}_-]/gu, "") || "malumotnoma"
  }.docx`;

  await bot.telegram.sendDocument(
    chatId,
    {
      source: docBuffer,
      filename,
    },
    {
      caption,
      parse_mode: "HTML",
    },
  );
}
