"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type FieldPath, useForm } from "react-hook-form";
import { toast } from "sonner";
import { slideVariants } from "@/shared/lib/slide-variants";
import { Button } from "@/shared/ui/button";
import { BottomActionWrapper, SectionWrapper, Wrapper } from "@/shared/ui/custom";
import { useCreateDemoInfo } from "../api/use-create-demo-info";
import { CREATE_DEMO_INFO_DEFAULT_VALUES } from "../model/default-values";
import { createDemoInfoFormSchema, type DemoInfoFormValues } from "../model/schema";
import EducationalInfo from "./education-info";
import ExtraInfo from "./extra-info";
import PersonalInfo from "./personal-info";
import RelativesInfo from "./relatives-info";

const STEPS = [
  "Shaxsiy ma'lumotlar",
  "Ta'lim ma'lumotlari",
  "Qarindoshlar ma'lumotlari",
  "Qo'shimcha ma'lumotlar",
] as const;

// Validate only the fields belonging to the current step.
const STEP_FIELDS: FieldPath<DemoInfoFormValues>[][] = [
  [
    "fullname",
    "birthdate",
    "passportNumber",
    "jshir",
    "gender",
    "nationality",
    "phone",
    "address",
    "region",
    "neighbourhood",
  ],
  ["faculty", "group", "speciality", "eduType", "eduMode", "specialityCode"],
  ["parents"],
  [
    "employerTin",
    "studentWorkplace",
    "position",
    "legalEntity",
    "employedByLegalEntity",
    "individualEntrepreneur",
    "farmHousehold",
    "employmentThroughLoan",
    "childcareUnderTwo",
    "selfEmployed",
    "disabilityGroupOneOrTwo",
    "nextEducationLevelCandidates",
    "academicLeave",
    "expelledFromStudies",
    "heldBackInCourse",
    "graduateWithOutstandingDebts",
    "foreignLanguageProficiency",
    "comment",
  ],
];

export const CreateDemographicalInfo = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const router = useRouter();
  const { mutateAsync: createDemoInfo } = useCreateDemoInfo();

  const form = useForm<DemoInfoFormValues>({
    resolver: zodResolver(createDemoInfoFormSchema),
    defaultValues: CREATE_DEMO_INFO_DEFAULT_VALUES,
    mode: "onChange",
    shouldUnregister: false,
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: DemoInfoFormValues) => {
    try {
      await createDemoInfo(data);

      toast.success("Ma’lumotlar muvaffaqiyatli saqlandi.");
      form.reset();
      setStep(0);
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ma’lumotlarni saqlashda xatolik yuz berdi.");
    }
  };

  const nextStep = async () => {
    const isValid = await form.trigger(STEP_FIELDS[step]);

    const stepError = STEP_FIELDS[step].map((field) => form.getFieldState(field).error?.message).find(Boolean);
    if (!isValid) {
      toast.error(stepError || "Ma'lumotlarni to'liq kiriting");
      return;
    }

    setDirection(1);
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const previousStep = () => {
    setDirection(-1);
    setStep((current) => Math.max(current - 1, 0));
  };

  return (
    <div className="space-y-5">
      <SectionWrapper className="rounded-t-none sticky top-0 z-10">
        <Wrapper>
          {/* Step navigator */}
          <div className="flex items-center mb-4">
            <button type="button" onClick={() => router.back()}>
              <ChevronLeft />
            </button>
            <h2 className="text-xl font-semibold text-center text-slate-800 self-center flex-1">{STEPS[step]}</h2>
          </div>

          <div className="flex items-center">
            {STEPS.map((item, index) => {
              const isCompleted = index < step;
              const isActive = index === step;

              return (
                <div key={item} className="flex flex-1 items-center last:flex-none">
                  <button
                    type="button"
                    onClick={async () => {
                      if (index < step) {
                        setDirection(-1);
                        setStep(index);
                      }
                    }}
                    disabled={index > step}
                    aria-current={isActive ? "step" : undefined}
                    className="flex flex-col items-center gap-2 disabled:cursor-not-allowed"
                  >
                    <span
                      className={[
                        "flex size-9 items-center justify-center rounded-full",
                        "border text-sm font-semibold transition-colors",
                        isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30 text-muted-foreground",
                      ].join(" ")}
                    >
                      {isCompleted ? <Check size={18} /> : index + 1}
                    </span>

                    <span
                      className={[
                        "hidden text-center text-xs sm:block",
                        isActive ? "font-semibold text-foreground" : "text-muted-foreground",
                      ].join(" ")}
                    >
                      {item}
                    </span>
                  </button>

                  {index < STEPS.length - 1 && (
                    <div
                      className={["mx-3 h-px flex-1 transition-colors", index < step ? "bg-primary" : "bg-border"].join(
                        " ",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Wrapper>
      </SectionWrapper>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Animated step content */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="pb-5"
            >
              {step === 0 && <PersonalInfo form={form} />}

              {step === 1 && <EducationalInfo form={form} />}

              {step === 2 && <RelativesInfo form={form} />}

              {step === 3 && <ExtraInfo form={form} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation actions */}
        <BottomActionWrapper>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-12 flex-1 text-base"
              onClick={previousStep}
              disabled={step === 0 || isSubmitting}
            >
              <ChevronLeft size={18} />
              Oldingi
            </Button>

            {step !== STEPS.length - 1 && (
              <Button type="button" className="h-12 flex-1 text-base" onClick={nextStep} disabled={isSubmitting}>
                Keyingi
                <ChevronRight size={18} />
              </Button>
            )}
          </div>
        </BottomActionWrapper>
      </form>
    </div>
  );
};

export default CreateDemographicalInfo;
