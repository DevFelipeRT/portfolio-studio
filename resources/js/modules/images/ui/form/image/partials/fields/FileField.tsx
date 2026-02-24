import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { ImageFormData } from '@/modules/images/core/forms';
import type React from 'react';

interface FileFieldProps {
  errors: FormErrors<keyof ImageFormData>;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

export function FileField({ errors, onChange }: FileFieldProps) {
  return (
    <FormField
      name="file"
      errors={errors}
      htmlFor="image-file"
      label="File"
      required
      errorId="image-file-error"
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="image-file"
          type="file"
          accept="image/*"
          onChange={onChange}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

