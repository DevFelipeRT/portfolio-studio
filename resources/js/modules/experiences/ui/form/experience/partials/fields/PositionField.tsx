import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';

interface PositionFieldProps {
  value: ExperienceFormData['position'];
  errors: FormErrors<keyof ExperienceFormData>;
  onChange(value: string): void;
}

export function PositionField({ value, errors, onChange }: PositionFieldProps) {
  return (
    <FormField
      name="position"
      errors={errors}
      htmlFor="position"
      label="Position"
      required
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="position"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

