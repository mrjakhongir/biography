import "server-only";

import type { DemoInfoFormValues } from "@/features/create-demo/model/schema";
import type { InfoFormValues } from "@/features/create-info/model/schema";
import { createBot } from "@/shared/lib/telegram/bot";

type FormValues = InfoFormValues | DemoInfoFormValues;

type StaffDocumentOptions = {
  values: FormValues;
  buffer: Buffer;
  fileType: "docx" | "xlsx";
  username?: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createFilename(fullname: string, fileType: "docx" | "xlsx"): string {
  const safeName = fullname
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\p{L}\p{N}_-]/gu, "");

  return `${safeName || "malumotnoma"}.${fileType}`;
}

export async function sendFormToStaff({ values, buffer, fileType, username }: StaffDocumentOptions): Promise<void> {
  const chatId = process.env.TELEGRAM_STAFF_GROUP_ID;

  if (!chatId) {
    throw new Error("TELEGRAM_STAFF_GROUP_ID is not configured");
  }

  const bot = createBot();

  const telegramUsername = username?.trim() ? `@${escapeHtml(username.replace(/^@/, ""))}` : "Mavjud emas";

  const caption = [
    `${fileType === "docx" ? `<b>Biografiya</b>` : "<b>Demografiya</b>"} `,
    `<b>F.I.Sh.:</b> ${escapeHtml(values.fullname.trim())}`,
    `<b>Fakultet:</b> ${escapeHtml(values.faculty.trim())}`,
    `<b>Guruh:</b> ${escapeHtml(values.group.trim())}`,
    `<b>Telegram:</b> ${telegramUsername}`,
  ].join("\n");

  const filename = createFilename(values.fullname, fileType);

  await bot.telegram.sendDocument(
    chatId,
    {
      source: buffer,
      filename,
    },
    {
      caption,
      parse_mode: "HTML",
    },
  );
}
