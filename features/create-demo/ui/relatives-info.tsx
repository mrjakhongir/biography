"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { SectionWrapper, Wrapper } from "@/shared/ui/custom";
import PhoneNumberInput from "@/shared/ui/custom/phone-input";
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import type { DemoInfoFormValues } from "../model/schema";

type Props = {
  form: UseFormReturn<DemoInfoFormValues>;
};

const RelativesInfo = ({ form }: Props) => {
  return (
    <div>
      <FieldGroup>
        <SectionWrapper>
          <Wrapper className="space-y-4">
            <h2 className="text-xl font-semibold">Ota ma`lumotlari</h2>
            {/* fullname */}
            <Field>
              <FieldLabel>
                FIO <span className="text-red-500">*</span>
              </FieldLabel>
              <Controller
                control={form.control}
                name="parents.father.fullname"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Nusratov Jahongir Nusratovich"
                    aria-invalid={!!form.formState.errors.parents?.father?.fullname}
                  />
                )}
              />
            </Field>

            {/* workplace */}
            <Field>
              <FieldLabel>
                Ish joyi <span className="text-red-500">*</span>
              </FieldLabel>
              <Controller
                control={form.control}
                name="parents.father.workplace"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Google Inc."
                    aria-invalid={!!form.formState.errors.parents?.father?.workplace}
                  />
                )}
              />
            </Field>

            {/* address */}
            <Field>
              <FieldLabel>
                Yashash manzili <span className="text-red-500">*</span>
              </FieldLabel>

              <Controller
                control={form.control}
                name="parents.father.address"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Buxoro viloyati, Shofirkon tumani, Zarchabek MFY, Zarchabek massivi, 30-uy"
                    aria-invalid={!!form.formState.errors.parents?.father?.address}
                  />
                )}
              />
            </Field>

            {/* phone */}
            <Field>
              <FieldLabel>Telefon raqami</FieldLabel>
              <Controller
                control={form.control}
                name="parents.father.phone"
                render={({ field, fieldState }) => <PhoneNumberInput {...field} error={fieldState.error} />}
              />
            </Field>
          </Wrapper>
        </SectionWrapper>

        <SectionWrapper>
          <Wrapper className="space-y-4">
            <h2 className="text-xl font-semibold">Ona ma`lumotlari</h2>
            {/* fullname */}
            <Field>
              <FieldLabel>
                FIO <span className="text-red-500">*</span>
              </FieldLabel>
              <Controller
                control={form.control}
                name="parents.mother.fullname"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Shukurova Aziza Ahmadovna"
                    aria-invalid={!!form.formState.errors.parents?.mother?.fullname}
                  />
                )}
              />
            </Field>

            {/* workplace */}
            <Field>
              <FieldLabel>
                Ish joyi <span className="text-red-500">*</span>
              </FieldLabel>
              <Controller
                control={form.control}
                name="parents.mother.workplace"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="38-maktab o'qituvchisi"
                    aria-invalid={!!form.formState.errors.parents?.mother?.workplace}
                  />
                )}
              />
            </Field>

            {/* address */}
            <Field>
              <FieldLabel>
                Yashash manzili <span className="text-red-500">*</span>
              </FieldLabel>

              <Controller
                control={form.control}
                name="parents.mother.address"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Buxoro viloyati, Shofirkon tumani, Zarchabek MFY, Zarchabek massivi, 30-uy"
                    aria-invalid={!!form.formState.errors.parents?.mother?.address}
                  />
                )}
              />
            </Field>

            {/* phone */}
            <Field>
              <FieldLabel>Telefon raqami</FieldLabel>
              <Controller
                control={form.control}
                name="parents.mother.phone"
                render={({ field, fieldState }) => <PhoneNumberInput {...field} error={fieldState.error} />}
              />
            </Field>
          </Wrapper>
        </SectionWrapper>
      </FieldGroup>
    </div>
  );
};

export default RelativesInfo;
