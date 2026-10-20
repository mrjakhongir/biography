"use client";

import { Info, Plus, Trash2 } from "lucide-react";
import { useRef } from "react";
import { Controller, type UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { SectionWrapper, Wrapper } from "@/shared/ui/custom";
import DateInput from "@/shared/ui/custom/date-input";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { type InfoFormValues, relativeSchema } from "../model/schema";

type Props = {
  form: UseFormReturn<InfoFormValues>;
};

const RELATIONS = [
  { value: "Otasi", label: "Otasi" },
  { value: "Onasi", label: "Onasi" },
  { value: "Akasi", label: "Akasi" },
  { value: "Ukasi", label: "Ukasi" },
  { value: "Opasi", label: "Opasi" },
  { value: "Singlisi", label: "Singlisi" },
  { value: "Turmush o'rtog'i", label: "Turmush o'rtog'i" },
  { value: "Qaynotasi", label: "Qaynotasi" },
  { value: "Qaynonasi", label: "Qaynonasi" },
  { value: "O'g'li", label: "O'g'li" },
  { value: "Qizi", label: "Qizi" },
] as const;

const RelativesInfo = ({ form }: Props) => {
  const { control, register, trigger, getValues, formState } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "relatives",
  });

  const addButtonRef = useRef<HTMLDivElement>(null);

  const addRelative = async () => {
    const relatives = getValues("relatives");

    // Validate each existing relative only.
    const results = relatives.map((relative) => relativeSchema.safeParse(relative));

    const invalidIndexes = results
      .map((result, index) => (!result.success ? index : -1))
      .filter((index) => index !== -1);

    if (invalidIndexes.length > 0) {
      const fieldsToValidate = invalidIndexes.flatMap(
        (index) =>
          [
            `relatives.${index}.relation`,
            `relatives.${index}.fullname`,
            `relatives.${index}.birthYear`,
            `relatives.${index}.region`,
            `relatives.${index}.workplace`,
            `relatives.${index}.address`,
          ] as const,
      );

      await trigger(fieldsToValidate);
      return;
    }

    append({
      relation: "",
      fullname: "",
      birthYear: "",
      region: "",
      workplace: "",
      address: "",
    });

    requestAnimationFrame(() => {
      addButtonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  return (
    <SectionWrapper>
      <Wrapper>
        <div className="space-y-6">
          {fields.map((item, index) => {
            const relation = getValues(`relatives.${index}.relation`);

            const errors = formState.errors.relatives?.[index];

            return (
              <section key={item.id} className="space-y-4 rounded-xl border p-4 sm:p-5">
                <div className="space-y-5">
                  {/* Relationship */}
                  <Field>
                    <div className="flex justify-between items-center">
                      <FieldLabel>
                        Qarindoshlik turi
                        <span className="text-red-500"> *</span>
                      </FieldLabel>

                      <Button size="lg" type="button" variant="destructive" onClick={() => remove(index)}>
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>

                    <Select
                      value={relation}
                      onValueChange={(value) =>
                        form.setValue(`relatives.${index}.relation`, value, { shouldValidate: true, shouldDirty: true })
                      }
                    >
                      <SelectTrigger aria-invalid={!!errors?.relation}>
                        <SelectValue placeholder="Qarindoshlikni tanlang" />
                      </SelectTrigger>

                      <SelectContent>
                        {RELATIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Full name */}
                  <Field>
                    <FieldLabel>
                      F.I.Sh.
                      <span className="text-red-500"> *</span>
                    </FieldLabel>

                    <Input
                      {...register(`relatives.${index}.fullname`)}
                      placeholder="Familiya, ism, otasining ismi"
                      aria-invalid={!!errors?.fullname}
                    />
                  </Field>

                  {/* Birthdate */}
                  <Field>
                    <FieldLabel>
                      Tug‘ilgan sana
                      <span className="text-red-500"> *</span>
                    </FieldLabel>

                    <Controller
                      control={form.control}
                      name={`relatives.${index}.birthYear`}
                      render={({ field }) => (
                        <DateInput
                          value={field.value}
                          onChange={field.onChange}
                          error={form.formState.errors.relatives?.[index]?.birthYear}
                        />
                      )}
                    />
                  </Field>

                  <div ref={addButtonRef}></div>

                  {/* Region / city */}
                  <Field>
                    <FieldLabel>
                      Viloyat & shahar/tuman
                      <span className="text-red-500"> *</span>
                    </FieldLabel>

                    <Input
                      {...register(`relatives.${index}.region`)}
                      placeholder="Buxoro viloyati, Shofirkon tumani"
                      aria-invalid={!!errors?.region}
                    />
                  </Field>

                  {/* Workplace / study place */}
                  <Field className="sm:col-span-2">
                    <FieldLabel>
                      Ish yoki o‘qish joyi
                      <span className="text-red-500"> *</span>
                    </FieldLabel>

                    <Input
                      {...register(`relatives.${index}.workplace`)}
                      placeholder="Tashkilot yoki ta'lim muassasasi"
                      aria-invalid={!!errors?.workplace}
                    />
                  </Field>

                  {/* Current address */}
                  <Field className="sm:col-span-2">
                    <FieldLabel>
                      Hozirgi yashash manzili (viloyat, tuman, mahalla/qishloq)
                      <span className="text-red-500"> *</span>
                    </FieldLabel>

                    <Textarea
                      {...register(`relatives.${index}.address`)}
                      placeholder="Buxoro viloyati, Shofirkon tumani, Zarchabek MFY"
                      aria-invalid={!!errors?.address}
                    />
                  </Field>
                </div>
              </section>
            );
          })}

          <div className="flex justify-center pt-2">
            <Button type="button" variant="outline" className="w-full" size="lg" onClick={addRelative}>
              <Plus className="mr-2 size-4" />
              Qarindosh qo‘shish
            </Button>
          </div>

          {fields.length < 2 && (
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900">
              <Info className="mt-0.5 size-5 shrink-0 text-blue-600" />

              <div className="space-y-1">
                <p className="text-sm font-semibold">Zaruriy ma&apos;lumotlar</p>
                <p className="text-sm leading-relaxed text-blue-800">
                  Davom etishdan oldin ota va ona haqidagi ma’lumotlarni kiriting.
                </p>
              </div>
            </div>
          )}
        </div>
      </Wrapper>
    </SectionWrapper>
  );
};

export default RelativesInfo;
