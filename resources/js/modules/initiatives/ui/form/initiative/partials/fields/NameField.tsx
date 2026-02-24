import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { InitiativeFormData } from '@/modules/initiatives/core/forms';

interface NameFieldProps {
  value: InitiativeFormData['name'];
  errors: FormErrors<keyof InitiativeFormData>;
  onChange(value: string): void;
}

export function NameField({ value, errors, onChange }: NameFieldProps) {
  return (
    <FormField name="name" errors={errors} htmlFor="name" label="Name" required>
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="name"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

