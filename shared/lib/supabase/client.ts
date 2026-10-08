import { createClient } from "@supabase/supabase-js";
import { getEnv } from "./admin";

export const supabaseClient = createClient(
  getEnv("NEXT_PUBLIC_SUPABASE_URL"),
  getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
);
