import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ProjectFormData } from '@/modules/projects/core/forms';

interface LiveUrlFieldProps {
  value: ProjectFormData['live_url'];
  errors: FormErrors<keyof ProjectFormData>;
  onChange(value: string): void;
}

export function LiveUrlField({ value, errors, onChange }: LiveUrlFieldProps) {
  return (
    <FormField
      name="live_url"
      errors={errors}
      htmlFor="live_url"
      label="Live URL"
      errorId="live-url-error"
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="live_url"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://"
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

