import { supabaseAdmin } from "../supabase/admin";
import { createBot } from "./bot";

export async function notifyDemoUser(userId: string) {
  const bot = createBot();

  const { data: user } = await supabaseAdmin.from("users").select("chat_id").eq("id", userId).single();

  if (!user) {
    return;
  }

  await bot.telegram.sendMessage(
    user.chat_id,
    `Demografik ma'lumotlaringiz qabul qilindi.\n` +
      `📄 To‘liq faylni olish uchun <a href="https://t.me/Oxu0811">5-Bino</a> ga bog‘laning.\n\n` +
      `📄 To‘liq faylni olish uchun <a href="https://t.me/Medoxu5">Asosiy bino</a> ga bog‘laning`,
    {
      parse_mode: "HTML",
    },
  );
}
