import type { Context, Telegraf } from "telegraf";
import { saveTelegramUser } from "@/entities/user/lib/save-user";

const channelUrl = "https://t.me/testgoofficial";

export function registerStartHandler(bot: Telegraf) {
  const channelId = "-1003482290321";

  bot.start(async (ctx) => {
    if (!process.env.MINI_APP_URL) {
      throw new Error("MINI_APP_URL is not set");
    }

    await saveTelegramUser({
      telegramId: String(ctx.from.id),
      chatId: String(ctx.chat.id),
      firstName: ctx.from.first_name,
      username: ctx.from.username,
    });

    const isMember = await checkMembership(bot, ctx.from.id);

    if (isMember) {
      await sendWelcome(ctx);
      return;
    }

    await sendJoinPrompt(ctx, channelUrl);
  });

  bot.action("verify_channel_membership", async (ctx) => {
    if (!channelId) {
      await ctx.answerCbQuery("Membership tekshiruvi sozlanmagan.");
      return;
    }

    const user = ctx.from;

    let isMember: boolean;

    try {
      isMember = await checkMembership(bot, user.id);
    } catch (error) {
      console.error("Channel membership check failed:", error);
      await ctx.answerCbQuery("Tekshirishda xatolik. Iltimos, qayta urinib ko'ring.");
      return;
    }

    if (!isMember) {
      await ctx.answerCbQuery("Avval rasmiy kanalga a'zo bo'ling!");
      return;
    }

    await ctx.answerCbQuery("A'zolik tasdiqlandi!");

    await ctx.editMessageText("A'zolik tasdiqlandi!");

    await saveTelegramUser({
      telegramId: String(user.id),
      chatId: String(ctx.chat?.id ?? user.id),
      firstName: user.first_name,
      username: user.username,
    });

    await sendWelcome(ctx);
  });
}

async function checkMembership(bot: Telegraf, userId: number): Promise<boolean> {
  const channelId = process.env.TELEGRAM_CHANNEL_ID;

  if (!channelId) {
    throw new Error("TELEGRAM_CHANNEL_ID is not set");
  }

  const member = await bot.telegram.getChatMember(channelId, userId);

  if (member.status === "creator" || member.status === "administrator" || member.status === "member") {
    return true;
  }

  return member.status === "restricted" && member.is_member;
}

async function sendJoinPrompt(ctx: Context, channelUrl: string) {
  await ctx.reply(
    [
      "Assalomu alaykum!",
      "",
      "Botdan foydalanish uchun rasmiy kanalimizga a'zo bo'ling.",
      "",
      "A'zo bo'lganingizdan so'ng, quyidagi tekshirish tugmasini bosing.",
    ].join("\n"),
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📢 Rasmiy kanalga a'zo bo'lish", url: channelUrl }],
          [
            {
              text: "✅ A'zo bo'ldim — tekshirish",
              callback_data: "verify_channel_membership",
            },
          ],
        ],
      },
    },
  );
}

async function sendWelcome(ctx: Context) {
  const miniAppUrl = process.env.MINI_APP_URL;

  if (!miniAppUrl) {
    throw new Error("MINI_APP_URL is not set");
  }

  const firstName = ctx.from?.first_name;

  if (!firstName) {
    throw new Error("First name is not set");
  }

  const welcomeText = [
    `<b>Ассалому алайкум, ${escapeHtml(firstName)}!</b>`,
    "",
    "Ma'lumotlaringizni oson tayyorlang",
    "",
    `Янгиликлар ва эълонлар: <a href="${escapeHtml(channelUrl)}">расмий каналимиз</a>`,
    "",
    "Бошлаш учун қуйидаги тугмани босинг",
  ].join("\n");

  await ctx.replyWithHTML(welcomeText, {
    link_preview_options: {
      is_disabled: true,
    },
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Yaratish",
            web_app: {
              url: miniAppUrl,
            },
          },
        ],
      ],
    },
  });
}

function escapeHtml(string_: string) {
  return string_.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
