import { FormField, type FormErrors } from '@/common/forms';
import { Checkbox } from '@/components/ui/checkbox';
import type { InitiativeFormData } from '@/modules/initiatives/core/forms';

interface DisplayFieldProps {
  value: InitiativeFormData['display'];
  errors: FormErrors<keyof InitiativeFormData>;
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

