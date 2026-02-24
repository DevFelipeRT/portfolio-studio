import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ContactChannelFormData } from '@/modules/contact-channels/core/forms';

interface ValueFieldProps {
  value: ContactChannelFormData['value'];
  errors: FormErrors<keyof ContactChannelFormData>;
  processing: boolean;
  onChange(value: string): void;
}

export function ValueField({ value, errors, processing, onChange }: ValueFieldProps) {
  return (
    <FormField
      name="value"
      errors={errors}
      htmlFor="value"
      label="Value"
      required
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="value"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Email, phone number, handle, or URL"
          disabled={processing}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

