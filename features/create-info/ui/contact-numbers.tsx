"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import { SectionWrapper, Wrapper } from "@/shared/ui/custom";
import PhoneNumberInput from "@/shared/ui/custom/phone-input";
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field";
import type { InfoFormValues } from "../model/schema";

type Props = {
  form: UseFormReturn<InfoFormValues>;
};

const ContactNumbers: React.FC<Props> = ({ form }) => {
  const { control } = form;
  return (
    <SectionWrapper>
      <Wrapper>
        <FieldGroup>
          <Field>
            <FieldLabel>Talabaning telefon raqami</FieldLabel>
            <Controller
              control={control}
              name="studentPhone"
              render={({ field, fieldState }) => <PhoneNumberInput {...field} error={fieldState.error} />}
            />
          </Field>

          <Field>
            <FieldLabel>Otasining telefon raqami</FieldLabel>
            <Controller
              control={control}
              name="fatherPhone"
              render={({ field, fieldState }) => <PhoneNumberInput {...field} error={fieldState.error} />}
            />
          </Field>

          <Field>
            <FieldLabel>Onasing telefon raqami</FieldLabel>
            <Controller
              control={control}
              name="motherPhone"
              render={({ field, fieldState }) => <PhoneNumberInput {...field} error={fieldState.error} />}
            />
          </Field>
        </FieldGroup>
      </Wrapper>
    </SectionWrapper>
  );
};

export default ContactNumbers;
