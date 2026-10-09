import { Controller, type UseFormReturn } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { SectionWrapper, Wrapper } from "@/shared/ui/custom";
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { RadioGroup } from "@/shared/ui/radio-group";
import type { InfoFormValues } from "../model/schema";

type Props = {
  form: UseFormReturn<InfoFormValues>;
};

const EducationalInfo: React.FC<Props> = ({ form }) => {
  return (
    <SectionWrapper>
      <Wrapper>
        <FieldGroup>
          {/* faculty */}
          <Field>
            <FieldLabel>
              Fakultet <span className="text-red-500">*</span>
            </FieldLabel>
            <Controller
              control={form.control}
              name="faculty"
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Tibbiyot"
                  aria-invalid={!!form.formState.errors.faculty}
                />
              )}
            />
          </Field>

          {/* group */}
          <Field>
            <FieldLabel>
              Guruh <span className="text-red-500">*</span>
            </FieldLabel>

            <Controller
              control={form.control}
              name="group"
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="412-MIB"
                  aria-invalid={!!form.formState.errors.group}
                />
              )}
            />
          </Field>

          {/* education */}
          <Field>
            <FieldLabel>
              Ma&apos;lumoti <span className="text-red-500">*</span>
            </FieldLabel>

            <Controller
              control={form.control}
              name="education"
              render={({ field, fieldState }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid grid-cols-3 gap-2"
                  aria-invalid={fieldState.invalid}
                >
                  {[
                    { label: "O‘rta", value: "medium" },
                    { label: "O‘rta maxsus", value: "medium-special" },
                    { label: "Oliy", value: "high" },
                  ].map((option) => {
                    const isSelected = field.value === option.value;

                    return (
                      <Button
                        key={option.value}
                        type="button"
                        size="lg"
                        variant={isSelected ? "default" : "outline"}
                        className="w-full"
                        onClick={() => field.onChange(option.value)}
                        aria-pressed={isSelected}
                      >
                        {option.label}
                      </Button>
                    );
                  })}
                </RadioGroup>
              )}
            />
          </Field>

          {/* graduatedOrganisation */}
          <Field>
            <FieldLabel>
              Tamomlangan muassasa nomi <span className="text-red-500">*</span>
            </FieldLabel>

            <Controller
              control={form.control}
              name="graduatedOrganisation"
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Buxoro shahar, 138-maktab"
                  aria-invalid={!!form.formState.errors.graduatedOrganisation}
                />
              )}
            />
          </Field>
        </FieldGroup>
      </Wrapper>
    </SectionWrapper>
  );
};

export default EducationalInfo;
