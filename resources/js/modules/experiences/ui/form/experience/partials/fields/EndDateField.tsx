import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';

interface EndDateFieldProps {
  value: ExperienceFormData['end_date'];
  errors: FormErrors<keyof ExperienceFormData>;
  onChange(value: string): void;
}

export function EndDateField({ value, errors, onChange }: EndDateFieldProps) {
  return (
    <FormField
      name="end_date"
      errors={errors}
      htmlFor="end_date"
      label="End date"
      errorId="end-date-error"
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="end_date"
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

