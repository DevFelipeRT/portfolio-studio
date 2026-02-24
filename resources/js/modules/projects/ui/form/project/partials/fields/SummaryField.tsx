import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ProjectFormData } from '@/modules/projects/core/forms';

interface SummaryFieldProps {
  value: ProjectFormData['summary'];
  errors: FormErrors<keyof ProjectFormData>;
  onChange(value: string): void;
}

export function SummaryField({ value, errors, onChange }: SummaryFieldProps) {
  return (
    <FormField
      name="summary"
      errors={errors}
      htmlFor="summary"
      label="Summary"
      required
    >
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

