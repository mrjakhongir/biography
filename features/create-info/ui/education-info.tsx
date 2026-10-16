import { Controller, type UseFormReturn } from "react-hook-form";
import { SectionWrapper, Wrapper } from "@/shared/ui/custom";
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import type { InfoFormValues } from "../model/schema";

type Props = {
  form: UseFormReturn<InfoFormValues>;
};

const EducationalInfo: React.FC<Props> = ({ form }) => {
  return (
    <SectionWrapper>
      <Wrapper>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            {/* Start year */}
            <Field>
              <FieldLabel>
                O&apos;qishga kirgan yili
                <span className="text-red-500"> *</span>
              </FieldLabel>
              <Controller
                control={form.control}
                name="startYear"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="2026"
                    inputMode="numeric"
                    maxLength={4}
                    aria-invalid={!!form.formState.errors?.startYear}
                  />
                )}
              />
            </Field>

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
                    placeholder="33-dav-26"
                    aria-invalid={!!form.formState.errors.group}
                  />
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
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Stomatologiya"
                    aria-invalid={!!form.formState.errors.speciality}
                  />
                )}
              />
            </Field>
          </div>

          {/* Languages */}
          <Field>
            <FieldLabel>
              Chet tillari<span className="text-red-500">*</span>
            </FieldLabel>

            <Controller
              control={form.control}
              name="languages"
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Rus tili, Ingliz tili"
                  aria-invalid={!!form.formState.errors.languages}
                />
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
                  placeholder="Buxoro viloyati, Shofirkon tumani 38-maktab"
                  aria-invalid={!!form.formState.errors.graduatedOrganisation}
                />
              )}
            />
          </Field>

          <Field>
            <FieldLabel>
              Tamomlangan muassasada o&apos;qish davri <span className="text-red-500">*</span>
            </FieldLabel>

            <Controller
              control={form.control}
              name="graduatedOrganisationPeriod"
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="2015-yil 2026-yil"
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
