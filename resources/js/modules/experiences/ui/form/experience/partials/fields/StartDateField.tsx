import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';

interface StartDateFieldProps {
  value: ExperienceFormData['start_date'];
  errors: FormErrors<keyof ExperienceFormData>;
  onChange(value: string): void;
}

export function StartDateField({
  value,
  errors,
  onChange,
}: StartDateFieldProps) {
  return (
    <FormField
      name="start_date"
      errors={errors}
      htmlFor="start_date"
      label="Start date"
      required
      errorId="start-date-error"
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="start_date"
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

