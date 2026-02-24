import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ImageFormData } from '@/modules/images/core/forms';

interface ImageTitleFieldProps {
  value: ImageFormData['image_title'];
  errors: FormErrors<keyof ImageFormData>;
  processing: boolean;
  onChange(value: string): void;
}

export function ImageTitleField({
  value,
  errors,
  processing,
  onChange,
}: ImageTitleFieldProps) {
  return (
    <FormField
      name="image_title"
      errors={errors}
      htmlFor="image-title"
      label="Title"
      errorId="image-title-error"
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="image-title"
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

