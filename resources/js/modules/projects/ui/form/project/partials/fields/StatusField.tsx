import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ProjectFormData } from '@/modules/projects/core/forms';

interface StatusFieldProps {
  value: ProjectFormData['status'];
  errors: FormErrors<keyof ProjectFormData>;
  onChange(value: string): void;
}

export function StatusField({ value, errors, onChange }: StatusFieldProps) {
  return (
    <FormField
      name="status"
      errors={errors}
      htmlFor="status"
      label="Status"
      required
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="status"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Example: draft, published"
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

