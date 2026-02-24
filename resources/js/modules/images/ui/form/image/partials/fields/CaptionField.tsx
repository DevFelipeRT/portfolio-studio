import { FormField, type FormErrors } from '@/common/forms';
import { Textarea } from '@/components/ui/textarea';
import type { ImageFormData } from '@/modules/images/core/forms';

interface CaptionFieldProps {
  value: ImageFormData['caption'];
  errors: FormErrors<keyof ImageFormData>;
  processing: boolean;
  onChange(value: string): void;
}

export function CaptionField({
  value,
  errors,
  processing,
  onChange,
}: CaptionFieldProps) {
  return (
    <FormField
      name="caption"
      errors={errors}
      htmlFor="image-caption"
      label="Caption"
      errorId="image-caption-error"
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Textarea
          id="image-caption"
          rows={3}
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

