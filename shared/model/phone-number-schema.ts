import { z } from "zod";

export const phoneNumberSchema = z
  .string()
  .regex(/^\+998 \(\d{2}\) \d{3} \d{2} \d{2}$/, "Telefon raqamini to‘liq kiriting");
