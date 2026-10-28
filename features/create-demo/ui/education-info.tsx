import { Controller, type UseFormReturn } from "react-hook-form";
import { SectionWrapper, Wrapper } from "@/shared/ui/custom";
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import type { DemoInfoFormValues } from "../model/schema";
import SelectSpeciality from "./select-speciality";

type Props = {
  form: UseFormReturn<DemoInfoFormValues>;
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={!!form.formState.errors.faculty}
                >
                  <SelectTrigger aria-invalid={!!form.formState.errors.faculty}>
                    <SelectValue placeholder="Fakultet tanlang" />
                  </SelectTrigger>

                  <SelectContent>
                    {["Iqtisodiyot va pedagogika", "Tibbiyot", "Ijtimoiy fanlar va texnika"].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          {/* speciality */}
          <Field>
            <FieldLabel>
              Yo&apos;nalish <span className="text-red-500">*</span>
            </FieldLabel>

            <Controller
              control={form.control}
              name="speciality"
              render={({ field }) => (
                <SelectSpeciality
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={!!form.formState.errors.speciality}
                  setValue={form.setValue}
                />
              )}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            {/* specialityCode */}
            <Field>
              <FieldLabel>
                Yo&apos;nalish kodi <span className="text-red-500">*</span>
              </FieldLabel>

              <Controller
                control={form.control}
                name="specialityCode"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Stomatologiya"
                    aria-invalid={!!form.formState.errors.specialityCode}
                    readOnly
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
                    placeholder="33-dav-26"
                    aria-invalid={!!form.formState.errors.group}
                  />
                )}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* eduType */}
            <Field>
              <FieldLabel>
                Ta&apos;lim turi <span className="text-red-500">*</span>
              </FieldLabel>
              <Controller
                control={form.control}
                name="eduType"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={!!form.formState.errors.eduType}
                  >
                    <SelectTrigger aria-invalid={!!form.formState.errors.eduType}>
                      <SelectValue placeholder="Ta'lim turini" />
                    </SelectTrigger>

                    <SelectContent>
                      {["Bakalavr", "Magistr"].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            {/* eduMode */}
            <Field>
              <FieldLabel>
                Ta&apos;lim shakli <span className="text-red-500">*</span>
              </FieldLabel>
              <Controller
                control={form.control}
                name="eduMode"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={!!form.formState.errors.eduMode}
                  >
                    <SelectTrigger aria-invalid={!!form.formState.errors.eduMode}>
                      <SelectValue placeholder="Ta'lim shakli" />
                    </SelectTrigger>

                    <SelectContent>
                      {["Kunduzgi", "Kechgi", "Masofaviy"].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>
        </FieldGroup>
      </Wrapper>
    </SectionWrapper>
  );
};

export default EducationalInfo;
