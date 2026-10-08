import { createBot } from "@/shared/lib/telegram/bot";

// Change the import path to the real location of your createBot file.

const channelUsername = "@testgoofficial";
if (!channelUsername) {
  throw new Error("TELEGRAM_CHANNEL_USERNAME is not set");
}

const botUsername = "testoxubot";
if (!botUsername) {
  throw new Error("TELEGRAM_BOT_USERNAME is not set");
}

const welcomeText = [
  "🚀 <b>Test GO’ga xush kelibsiz!</b>",
  "",
  "Testlarga tayyorgarlik endi yanada  <b>oson, qulay va samarali.</b>",
  "",
  "<b>Test GO</b> — testlarni yechish, yaratish va ulashish uchun zamonaviy platforma.",
  "",
  "✨ <b>Sizni nimalar kutmoqda?</b>",
  "",
  "📚 <b>Samarali tayyorgarlik</b>",
  "Turli fanlardan testlarni yeching va bilimingizni mustahkamlang.",
  "",
  "📝 <b>Testlar yarating</b>",
  "O‘z testlaringizni oson yuklang va tartibli boshqaring.",
  "",
  "🔗 <b>Ulashish va sotish</b>",
  "Yaratgan testlaringizni boshqalar bilan ulashing yoki soting.",
  "",
  "⚡ <b>Oson yuklash</b>",
  "Testlarni tez va qulay tarzda platformaga yuklang.",
  "",
  "🎯 <b>Qulay interfeys</b>",
  "Kerakli testlarni topish va ishlash — ortiqcha murakkabliklarsiz.",
  "",
  "🤖 <b>Telegram bot</b>",
  "Test GO bilan Telegram orqali ham qulay ishlang.",
  "",
  "<b>Test GO — bilimni sinang, natijangizni oshiring! 🚀</b>",
  "",
  "📢 Rasmiy kanal: <b>@testoxu</b>",
  "",
  "🤖 Bot: <b>@testoxubot</b>",
].join("\n");

async function publishChannelWelcome() {
  const bot = createBot();

  const message = await bot.telegram.sendMessage(channelUsername, welcomeText, {
    parse_mode: "HTML",
    link_preview_options: {
      is_disabled: true,
    },
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🤖 Ботни очиш",
            url: `https://t.me/${botUsername}`,
          },
        ],
      ],
    },
  });

  await bot.telegram.pinChatMessage(channelUsername, message.message_id, {
    disable_notification: true,
  });

  console.log("✅ Welcome post published and pinned");
  console.log(`Message ID: ${message.message_id}`);
}

publishChannelWelcome().catch((error: unknown) => {
  console.error("❌ Failed to publish channel welcome:", error);
  process.exitCode = 1;
});

// npx tsx --env-file=.env shared/lib/telegram/publish-welcome.ts
