import { useEffect } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { SectionWrapper, Wrapper } from "@/shared/ui/custom";
import { FieldGroup } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Spinner } from "@/shared/ui/spinner";
import { Switch } from "@/shared/ui/switch";
import type { DemoInfoFormValues } from "../model/schema";

type Props = {
  form: UseFormReturn<DemoInfoFormValues>;
};

const employmentFields = [
  { name: "employerTin", label: "Ish Beruvchi INN" },
  { name: "studentWorkplace", label: "Talabaning Ish Joyi" },
  { name: "position", label: "Lavozimi" },
  { name: "legalEntity", label: "Yuridik shaxs ta'sischisi" },
  { name: "employedByLegalEntity", label: "Yuridik shaxsda band" },
  { name: "individualEntrepreneur", label: "YaTT" },
  { name: "farmHousehold", label: "Dehqon xo'jaligi tashkil etganlar" },
  { name: "employmentThroughLoan", label: "Kredit olish orqali bandlik" },
  {
    name: "childcareUnderTwo",
    label: "Ikki yoshgacha bola parvarishi bilan band",
  },
  { name: "selfEmployed", label: "O'zini o'zi band qilganlar" },
  { name: "disabilityGroupOneOrTwo", label: "1-2 Guruh nogironi" },
  {
    name: "nextEducationLevelCandidates",
    label: "Ta'limning keyingi bosqichida qamrab olinadiganlar",
  },
  { name: "academicLeave", label: "Akademik ta'tili olganlar" },
  { name: "expelledFromStudies", label: "O'qishdan chetlashtirilgan" },
  { name: "heldBackInCourse", label: "Kursdan qolgan" },
  { name: "graduateWithOutstandingDebts", label: "Qarzdor bitiruvchi" },
  {
    name: "foreignLanguageProficiency",
    label: "Xorijiy tillarni bilish darajasi (CEFR, IELTS)",
  },
  { name: "comment", label: "Izoh" },
] as const;

const ExtraInfo: React.FC<Props> = ({ form }) => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <div>
      <SectionWrapper>
        <Wrapper>
          <FieldGroup className="gap-4">
            {employmentFields.map(({ name, label }) => (
              <Controller
                key={name}
                name={name}
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col justify-between gap-2">
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                    <Input {...field} />
                  </div>
                )}
              />
            ))}
          </FieldGroup>
        </Wrapper>
      </SectionWrapper>

      <Wrapper className="mt-5">
        <Button
          type="submit"
          className="h-12 flex-1 text-base w-full shadow-lg"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? <Spinner /> : "Yaratish"}
        </Button>
      </Wrapper>
    </div>
  );
};

export default ExtraInfo;
