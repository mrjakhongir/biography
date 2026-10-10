import { createBot } from "@/shared/lib/telegram/bot";

const bot = createBot();

export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-telegram-bot-api-secret-token");

    if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    const update = await request.json();

    await bot.handleUpdate(update);

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal Error", { status: 500 });
  }
}
