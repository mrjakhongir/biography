"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRef } from "react";
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { SectionWrapper, Wrapper } from "@/shared/ui/custom";
import { Field, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import type { InfoFormValues } from "../model/schema";

type Props = {
  form: UseFormReturn<InfoFormValues>;
};

const RELATIONS = [
  { value: "father", label: "Otasi" },
  { value: "mother", label: "Onasi" },
  { value: "akasi", label: "Akasi" },
  { value: "ukasi", label: "Ukasi" },
  { value: "opasi", label: "Opasi" },
  { value: "singlisi", label: "Singlisi" },
  { value: "wife", label: "Xotini" },
  { value: "husband", label: "Eri" },
  { value: "father_in_law", label: "Qaynotasi" },
  { value: "mother_in_law", label: "Qaynonasi" },
  { value: "son", label: "O'g'li" },
  { value: "daughter", label: "Qizi" },
] as const;

const RelativesInfo = ({ form }: Props) => {
  const { control, register, trigger, getValues, formState } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "relatives",
  });

  const addButtonRef = useRef<HTMLButtonElement>(null);

  const addRelative = async () => {
    const isValid = await trigger("relatives");

    // if (!isValid) return;

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
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Relationship */}
                  <Field>
                    <FieldLabel>
                      Qarindoshlik turi
                      <span className="text-red-500"> *</span>
                    </FieldLabel>

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

                  {/* Birth year */}
                  <Field>
                    <FieldLabel>
                      Tug‘ilgan yili
                      <span className="text-red-500"> *</span>
                    </FieldLabel>

                    <Input
                      {...register(`relatives.${index}.birthYear`)}
                      placeholder="1980"
                      inputMode="numeric"
                      maxLength={4}
                      aria-invalid={!!errors?.birthYear}
                    />
                  </Field>

                  {/* Region / city */}
                  <Field>
                    <FieldLabel>
                      Viloyat yoki shahar
                      <span className="text-red-500"> *</span>
                    </FieldLabel>

                    <Input
                      {...register(`relatives.${index}.region`)}
                      placeholder="Toshkent shahri"
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
                      Hozirgi yashash manzili
                      <span className="text-red-500"> *</span>
                    </FieldLabel>

                    <Textarea
                      {...register(`relatives.${index}.address`)}
                      placeholder="Viloyat, tuman, ko‘cha, uy"
                      aria-invalid={!!errors?.address}
                    />
                  </Field>
                </div>

                <Button size="lg" type="button" variant="destructive" className="w-full" onClick={() => remove(index)}>
                  O&apos;chirish
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </section>
            );
          })}

          <div className="flex justify-center pt-2">
            <Button
              ref={addButtonRef}
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              onClick={addRelative}
            >
              <Plus className="mr-2 size-4" />
              Qarindosh qo‘shish
            </Button>
          </div>
        </div>
      </Wrapper>
    </SectionWrapper>
  );
};

export default RelativesInfo;
