import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';

interface CompanyFieldProps {
  value: ExperienceFormData['company'];
  errors: FormErrors<keyof ExperienceFormData>;
  onChange(value: string): void;
}

export function CompanyField({ value, errors, onChange }: CompanyFieldProps) {
  return (
    <FormField
      name="company"
      errors={errors}
      htmlFor="company"
      label="Company"
      required
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="company"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

