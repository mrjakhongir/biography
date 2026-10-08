import { Telegraf } from "telegraf";
import { registerPaymentHandlers } from "./handlers/payment";
import { registerStartHandler } from "./handlers/start";

const token = process.env.TELEGRAM_BOT_TOKEN;

export function createBot() {
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured.");
  }
  const bot = new Telegraf(token);

  registerStartHandler(bot);
  registerPaymentHandlers(bot);

  bot.catch((error, context) => {
    console.error(error, context.update);
  });

  return bot;
}
