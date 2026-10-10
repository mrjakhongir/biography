import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import type { IUser } from "../model/types";

export async function saveTelegramUser(input: IUser) {
  const { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .upsert(
      {
        telegram_id: input.telegramId,
        first_name: input.firstName,
        username: input.username,
      },
      {
        onConflict: "telegram_id",
      },
    )
    .select("id, telegram_id")
    .single();

  if (userError) {
    throw new Error(userError.message);
  }

  return user;
}
