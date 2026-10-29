import { z } from "zod";
import { birthdateSchema } from "@/shared/model/birthdate-schema";
import { phoneNumberSchema } from "@/shared/model/phone-number-schema";

const parentSchema = z.object({
  fullname: z.string().trim().min(2, "F.I.Sh. kamida 2 ta belgidan iborat bo‘lishi kerak"),
  workplace: z.string().trim().min(2, "Ish joyi kamida 2 ta belgidan iborat bo‘lishi kerak"),
  phone: z.string().trim().min(2, "Telefon raqami kamida 2 ta belgidan iborat bo‘lishi kerak"),
  address: z.string().trim().min(2, "Manzil kamida 2 ta belgidan iborat bo‘lishi kerak"),
});

export const createDemoInfoFormSchema = z.object({
  // personal info
  fullname: z.string().min(5, "F.I.O. kiritilishi shart"),
  birthdate: birthdateSchema,
  passportNumber: z.string().regex(/^[A-Za-z]{2}\d{7}$/, {
    message: "Passport number must contain 2 Latin letters followed by 7 digits",
  }),
  jshir: z.string().regex(/^\d{14}$/, {
    message: "JSHSHIR must contain exactly 14 digits",
  }),
  gender: z.string().min(1, "Jinsi kiritilishi shart"),
  nationality: z.string().min(2, "Millatingizni kiriting"),
  phone: phoneNumberSchema,
  address: z.string().min(2, "Yashahs manzilini kiriting"),
  region: z.string().min(2, "Tug'ilgan tumaningizni kiriting"),
  neighbourhood: z.string().min(2, "Tug'ilgan mahallangizni kiriting"),

  // education info
  faculty: z.string().min(2),
  group: z.string().min(2),
  eduType: z.string().min(2),
  eduMode: z.string().min(2),
  speciality: z.string().min(2),
  specialityCode: z.string().min(2),

  // parents info
  parents: z.object({
    father: parentSchema,
    mother: parentSchema,
  }),

  // extra
  employerTin: z.string(),
  studentWorkplace: z.string(),
  position: z.string(),
  legalEntity: z.string(),
  employedByLegalEntity: z.string(),
  individualEntrepreneur: z.string(),
  farmHousehold: z.string(),
  employmentThroughLoan: z.string(),
  childcareUnderTwo: z.string(),
  selfEmployed: z.string(),
  disabilityGroupOneOrTwo: z.string(),
  nextEducationLevelCandidates: z.string(),
  academicLeave: z.string(),
  expelledFromStudies: z.string(),
  heldBackInCourse: z.string(),
  graduateWithOutstandingDebts: z.string(),
  foreignLanguageProficiency: z.string(),
  comment: z.string(),
});

export type DemoInfoFormValues = z.infer<typeof createDemoInfoFormSchema>;
