import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ContactChannelFormData } from '@/modules/contact-channels/core/forms';

interface LabelFieldProps {
  value: ContactChannelFormData['label'];
  errors: FormErrors<keyof ContactChannelFormData>;
  processing: boolean;
  onChange(value: string): void;
}

export function LabelField({ value, errors, processing, onChange }: LabelFieldProps) {
  return (
    <FormField name="label" errors={errors} htmlFor="label" label="Label">
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="label"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Optional label"
          disabled={processing}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

