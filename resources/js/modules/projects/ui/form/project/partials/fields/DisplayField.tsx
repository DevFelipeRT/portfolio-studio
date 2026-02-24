import { FormField, type FormErrors } from '@/common/forms';
import { Checkbox } from '@/components/ui/checkbox';
import type { ProjectFormData } from '@/modules/projects/core/forms';

interface DisplayFieldProps {
  value: ProjectFormData['display'];
  errors: FormErrors<keyof ProjectFormData>;
  onChange(value: boolean): void;
}

export function DisplayField({ value, errors, onChange }: DisplayFieldProps) {
  return (
    <FormField
      name="display"
      errors={errors}
      htmlFor="display"
      label="Display on landing"
      variant="inline"
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

