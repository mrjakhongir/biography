import { z } from "zod";

export const birthdateSchema = z
  .string()
  .min(1, "Date of birth is required")
  .regex(/^\d{2}\.\d{2}\.\d{4}$/, "Enter date in DD.MM.YYYY format")
  .refine((value) => {
    const [day, month, year] = value.split(".").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }, "Enter a valid date");
