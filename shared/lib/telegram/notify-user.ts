import type { InfoFormValues } from "@/features/create-info/model/schema";
import { supabaseAdmin } from "../supabase/admin";
import { createBot } from "./bot";
import { formatPersonalInfoMessage } from "./format-personal-info-message";

export async function notifyCustomer(userId: string, values: InfoFormValues) {
  const bot = createBot();

  const { data: user } = await supabaseAdmin.from("users").select("chat_id").eq("id", userId).single();

  if (!user) {
    return;
  }

  await bot.telegram.sendMessage(user.chat_id, formatPersonalInfoMessage(values), {
    parse_mode: "HTML",
  });
}
