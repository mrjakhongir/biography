import { z } from "zod";
import { birthdateSchema } from "@/shared/model/birthdate-schema";
import { phoneNumberSchema } from "@/shared/model/phone-number-schema";

export const relativeSchema = z.object({
  relation: z.string().min(1, "Qarindoshlik turini tanlang"),
  fullname: z.string().trim().min(1, "F.I.Sh. kiritilishi shart"),
  birthYear: birthdateSchema,
  region: z.string().trim().min(1, "Viloyat yoki shaharni kiriting"),
  workplace: z.string().trim().min(1, "Ish yoki o‘qish joyini kiriting"),
  address: z.string().trim().min(1, "Yashash manzilini kiriting"),
});

export const createInfoFormSchema = z.object({
  fullname: z.string().min(5, "F.I.O. kiritilishi shart"),
  birthdate: birthdateSchema,
  birthplace: z.string().min(2, "Tug'ilgan tumaningizni kiriting"),
  nationality: z.string().min(2, "Millatingizni kiriting"),
  hasJoinedParty: z.string(),

  graduatedOrganisation: z.string(),
  graduatedOrganisationPeriod: z.string(),
  startYear: z.string().min(4),
  faculty: z.string().min(2),
  group: z.string().min(2),
  speciality: z.string().min(2),
  languages: z.string().min(2),

  relatives: z
    .array(relativeSchema)
    .min(2, "Ota va ona ma'lumotlari kiritilishi shart")
    .refine((relatives) => relatives.some((relative) => relative.relation === "Otasi"), {
      message: "Ota ma'lumotlari kiritilishi shart",
    })
    .refine((relatives) => relatives.some((relative) => relative.relation === "Onasi"), {
      message: "Ona ma'lumotlari kiritilishi shart",
    }),

  studentPhone: phoneNumberSchema,
  fatherPhone: phoneNumberSchema,
  motherPhone: phoneNumberSchema,
});

export type InfoFormValues = z.infer<typeof createInfoFormSchema>;
