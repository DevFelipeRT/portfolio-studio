import { FormField, type FormErrors } from '@/common/forms';
import { Checkbox } from '@/components/ui/checkbox';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';

interface DisplayFieldProps {
  value: ExperienceFormData['display'];
  errors: FormErrors<keyof ExperienceFormData>;
  onChange(value: boolean): void;
}

export function DisplayField({ value, errors, onChange }: DisplayFieldProps) {
  return (
    <FormField
      name="display"
      errors={errors}
      htmlFor="display"
      label="Display on portfolio"
      variant="inline"
      className="pt-1"
    >
      {({ a11yAttributes }) => (
        <Checkbox
          id="display"
          checked={value}
          onCheckedChange={(checked) => onChange(!!checked)}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

