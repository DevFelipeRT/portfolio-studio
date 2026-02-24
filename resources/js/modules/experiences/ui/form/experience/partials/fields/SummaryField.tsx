import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';

interface SummaryFieldProps {
  value: ExperienceFormData['summary'];
  errors: FormErrors<keyof ExperienceFormData>;
  onChange(value: string): void;
}

export function SummaryField({ value, errors, onChange }: SummaryFieldProps) {
  return (
    <FormField name="summary" errors={errors} htmlFor="summary" label="Summary">
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="summary"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

