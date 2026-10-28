import { Controller, type UseFormReturn } from "react-hook-form";
import type { DemoInfoFormValues } from "@/features/create-demo/model/schema";
import { SectionWrapper, Wrapper } from "@/shared/ui/custom";
import DateInput from "@/shared/ui/custom/date-input";
import JshirNumberInput from "@/shared/ui/custom/jshir-input";
import PassportNumberInput from "@/shared/ui/custom/passport-number-input";
import PhoneNumberInput from "@/shared/ui/custom/phone-input";
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

type Props = {
  form: UseFormReturn<DemoInfoFormValues>;
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

          <div className="flex items-center gap-4">
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

            {/* passport */}
            <Field>
              <FieldLabel>
                Passport raqami <span className="text-red-500">*</span>
              </FieldLabel>

              <Controller
                control={form.control}
                name="passportNumber"
                render={({ field, fieldState }) => <PassportNumberInput {...field} error={fieldState.error} />}
              />
            </Field>
          </div>

          {/* jshir */}
          <Field>
            <FieldLabel>
              JSHIR <span className="text-red-500">*</span>
            </FieldLabel>

            <Controller
              control={form.control}
              name="jshir"
              render={({ field, fieldState }) => <JshirNumberInput {...field} error={fieldState.error} />}
            />
          </Field>

          <div className="flex items-center gap-4">
            {/* gender */}
            <Field>
              <FieldLabel>
                Jinsi <span className="text-red-500">*</span>
              </FieldLabel>
              <Controller
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={!!form.formState.errors.gender}
                  >
                    <SelectTrigger aria-invalid={!!form.formState.errors.gender}>
                      <SelectValue placeholder="Jinsingizni kiriting" />
                    </SelectTrigger>

                    <SelectContent>
                      {["Erkak", "Ayol"].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          </div>

          {/* phone */}
          <Field>
            <FieldLabel>Telefon raqami</FieldLabel>
            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => <PhoneNumberInput {...field} error={fieldState.error} />}
            />
          </Field>

          {/* address */}
          <Field>
            <FieldLabel>
              Yashash manzili <span className="text-red-500">*</span>
            </FieldLabel>

            <Controller
              control={form.control}
              name="address"
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Buxoro viloyati, Shofirkon tumani, Zarchabek MFY, Zarchabek massivi, 30-uy"
                  aria-invalid={!!form.formState.errors.address}
                />
              )}
            />
          </Field>

          <div className="flex items-center gap-4">
            {/* region */}
            <Field>
              <FieldLabel>
                Tuman <span className="text-red-500">*</span>
              </FieldLabel>

              <Controller
                control={form.control}
                name="region"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Shofirkon tumani"
                    aria-invalid={!!form.formState.errors.region}
                  />
                )}
              />
            </Field>

            {/* neighbourhood */}
            <Field>
              <FieldLabel>
                Mahalla <span className="text-red-500">*</span>
              </FieldLabel>

              <Controller
                control={form.control}
                name="neighbourhood"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Zarchabek MFY"
                    aria-invalid={!!form.formState.errors.neighbourhood}
                  />
                )}
              />
            </Field>
          </div>
        </FieldGroup>
      </Wrapper>
    </SectionWrapper>
  );
};

export default PersonalInfo;
