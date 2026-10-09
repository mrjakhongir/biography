"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { type FieldPath, useForm } from "react-hook-form";

import { Button } from "@/shared/ui/button";
import { BottomActionWrapper, SectionWrapper, Wrapper } from "@/shared/ui/custom";
import { Spinner } from "@/shared/ui/spinner";

import { CREATE_INFO_DEFAULT_VALUES } from "../model/default-values";
import { createInfoFormSchema, type InfoFormValues } from "../model/schema";
import EducationalInfo from "./education-info";
import PersonalInfo from "./personal-info";
import RelativesInfo from "./relatives-info";

const STEPS = [
  {
    title: "Shaxsiy ma'lumotlar",
  },
  {
    title: "Ta'lim ma'lumotlari",
  },
  {
    title: "Qarindoshlar ma'lumotlari",
  },
] as const;

// Validate only the fields belonging to the current step.
const STEP_FIELDS: FieldPath<InfoFormValues>[][] = [
  ["fullname", "birthdate", "birthplace", "nationality", "hasJoinedParty"],
  ["education", "graduatedOrganisation", "faculty", "group"],
  ["relatives"],
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export const CreatePersonalInfo = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const form = useForm<InfoFormValues>({
    resolver: zodResolver(createInfoFormSchema),
    defaultValues: CREATE_INFO_DEFAULT_VALUES,
    mode: "onChange",
    shouldUnregister: false,
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (data: InfoFormValues) => {
    console.log(data);
  };

  const nextStep = async () => {
    // const isValid = await form.trigger(STEP_FIELDS[step]);

    // if (!isValid) return;

    setDirection(1);
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const previousStep = () => {
    setDirection(-1);
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (step < STEPS.length - 1) {
      await nextStep();
      return;
    }

    await form.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-5">
      <SectionWrapper>
        <Wrapper>
          {/* Step navigator */}
          <div>
            <div className="flex items-center">
              {STEPS.map((item, index) => {
                const isCompleted = index < step;
                const isActive = index === step;

                return (
                  <div key={item.title} className="flex flex-1 items-center last:flex-none">
                    <button
                      type="button"
                      onClick={async () => {
                        // Only navigate backward directly.
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
                        {item.title}
                      </span>
                    </button>

                    {index < STEPS.length - 1 && (
                      <div
                        className={[
                          "mx-3 h-px flex-1 transition-colors",
                          index < step ? "bg-primary" : "bg-border",
                        ].join(" ")}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* <h2 className="text-xl font-semibold">{STEPS[step].title}</h2> */}
          </div>
        </Wrapper>
      </SectionWrapper>

      <form onSubmit={handleFormSubmit}>
        {/* Animated step content */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              {step === 0 && <PersonalInfo form={form} />}

              {step === 1 && <EducationalInfo form={form} />}

              {step === 2 && <RelativesInfo form={form} />}
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

            {step < STEPS.length - 1 ? (
              <Button type="button" className="h-12 flex-1 text-base" onClick={nextStep} disabled={isSubmitting}>
                Keyingi
                <ChevronRight size={18} />
              </Button>
            ) : (
              <Button type="submit" className="h-12 flex-1 text-base" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Spinner />
                ) : (
                  <>
                    Yaratish
                    <Check size={18} />
                  </>
                )}
              </Button>
            )}
          </div>
        </BottomActionWrapper>
      </form>
    </div>
  );
};

export default CreatePersonalInfo;
