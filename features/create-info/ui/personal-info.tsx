import { Controller, type UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/shared/ui/checkbox";
import { SectionWrapper, Wrapper } from "@/shared/ui/custom";
import DateInput from "@/shared/ui/custom/date-input";
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import type { InfoFormValues } from "../model/schema";

type Props = {
  form: UseFormReturn<InfoFormValues>;
};

const PersonalInfo: React.FC<Props> = ({ form }) => {
  return (
    <SectionWrapper>
      <Wrapper>
        <FieldGroup>
          {/* fullname */}
          <Field>
            <FieldLabel>
              FIO <span className="text-red-500">*</span>
            </FieldLabel>
            <Controller
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Nusratov Jahongir Nusratovich"
                  aria-invalid={!!form.formState.errors.fullname}
                />
              )}
            />
          </Field>

          {/* birthdate */}
          <Field>
            <FieldLabel>
              Tug`ilgan sana <span className="text-red-500">*</span>
            </FieldLabel>
            <Controller
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <DateInput value={field.value} onChange={field.onChange} error={form.formState.errors.birthdate} />
              )}
            />
          </Field>

          {/* birthplace */}
          <Field>
            <FieldLabel>
              Tug`ilgan joy <span className="text-red-500">*</span>
            </FieldLabel>

            <Controller
              control={form.control}
              name="birthplace"
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Buxoro viloyat, Shofirkon tuman"
                  aria-invalid={!!form.formState.errors.birthplace}
                />
              )}
            />
          </Field>

          {/* nationality */}
          <Field>
            <FieldLabel>
              Millati <span className="text-red-500">*</span>
            </FieldLabel>

            <Controller
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="O'zbek"
                  aria-invalid={!!form.formState.errors.nationality}
                />
              )}
            />
          </Field>

          {/* hasJoinedParty */}
          <Field>
            <Controller
              control={form.control}
              name="hasJoinedParty"
              render={({ field, fieldState }) => (
                <div className="flex items-center gap-2">
                  <FieldLabel htmlFor="party">
                    Partiyaviyligi
                    <span className="text-red-500"> *</span>
                  </FieldLabel>

                  <Checkbox
                    checked={field.value === "true"}
                    onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                    aria-invalid={fieldState.invalid}
                    id="party"
                  />
                </div>
              )}
            />
          </Field>
        </FieldGroup>
      </Wrapper>
    </SectionWrapper>
  );
};

export default PersonalInfo;
