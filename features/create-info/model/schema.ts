import { z } from "zod";

export const relativeSchema = z.object({
  relation: z.string().min(1, "Qarindoshlik turini tanlang"),
  fullname: z.string().trim().min(1, "F.I.Sh. kiritilishi shart"),
  birthYear: z
    .string()
    .regex(/^\d{4}$/, "Tug‘ilgan yilni 4 ta raqamda kiriting")
    .refine((value) => {
      const year = Number(value);
      return year >= 1900 && year <= new Date().getFullYear();
    }, "Tug‘ilgan yil noto‘g‘ri"),
  region: z.string().trim().min(1, "Viloyat yoki shaharni kiriting"),
  workplace: z.string().trim().min(1, "Ish yoki o‘qish joyini kiriting"),
  address: z.string().trim().min(1, "Yashash manzilini kiriting"),
});

export const birthdateSchema = z
  .string()
  .min(1, "Date of birth is required")
  .regex(/^\d{2}\.\d{2}\.\d{4}$/, "Enter date in DD.MM.YYYY format")
  .refine((value) => {
    const [day, month, year] = value.split(".").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }, "Enter a valid date")
  .refine((value) => {
    const [day, month, year] = value.split(".").map(Number);
    const birthdate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minimumBirthdate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    return birthdate <= minimumBirthdate;
  }, "You must be at least 16 years old");

export const createInfoFormSchema = z.object({
  fullname: z.string().min(5),
  birthdate: birthdateSchema,
  birthplace: z.string().min(2),
  nationality: z.string().min(2),
  hasJoinedParty: z.string(),

  education: z.string().min(2),
  graduatedOrganisation: z.string(),
  faculty: z.string().min(2),
  group: z.string().min(2),

  relatives: z
    .array(relativeSchema)
    .min(2, "Ota va ona ma'lumotlari kiritilishi shart")
    .refine((relatives) => relatives.some((relative) => relative.relation === "father"), {
      message: "Ota ma'lumotlari kiritilishi shart",
    })
    .refine((relatives) => relatives.some((relative) => relative.relation === "mother"), {
      message: "Ona ma'lumotlari kiritilishi shart",
    }),
});

export type InfoFormValues = z.infer<typeof createInfoFormSchema>;
