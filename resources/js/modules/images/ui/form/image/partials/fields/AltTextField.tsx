import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ImageFormData } from '@/modules/images/core/forms';

interface AltTextFieldProps {
  value: ImageFormData['alt_text'];
  errors: FormErrors<keyof ImageFormData>;
  processing: boolean;
  onChange(value: string): void;
}

export function AltTextField({
  value,
  errors,
  processing,
  onChange,
}: AltTextFieldProps) {
  return (
    <FormField
      name="alt_text"
      errors={errors}
      htmlFor="image-alt-text"
      label="Alt text"
      required
      errorId="image-alt-text-error"
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="image-alt-text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={processing}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

