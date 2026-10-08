import type { Telegraf } from "telegraf";
import { saveTelegramUser } from "@/entities/user/lib/save-user";

export function registerStartHandler(bot: Telegraf) {
  bot.start(async (context) => {
    const miniAppUrl = process.env.MINI_APP_URL;

    if (!miniAppUrl) {
      throw new Error("MINI_APP_URL is not set");
    }

    const firstName = context.from.first_name;

    const channelUrl = process.env.TELEGRAM_CHANNEL_URL ?? "https://t.me/testgoofficial";

    const welcomeText = [
      `<b>Ассалому алайкум, ${escapeHtml(firstName)}!</b>`,
      "",
      "Testlarga oson tayyorlaning",
      "",
      `Янгиликлар ва эълонлар: <a href="${escapeHtml(channelUrl)}">расмий каналимиз</a>`,
      "",
      "Бошлаш учун қуйидаги тугмани босинг",
    ].join("\n");

    await context.replyWithHTML(welcomeText, {
      link_preview_options: {
        is_disabled: true,
      },
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Test yechish",
              web_app: {
                url: miniAppUrl,
              },
            },
          ],
        ],
      },
    });

    await saveTelegramUser({
      telegramId: String(context.from.id),
      firstName: context.from.first_name,
      lastName: context.from.last_name,
      username: context.from.username,
    });
  });
}

function escapeHtml(string_: string) {
  return string_.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
