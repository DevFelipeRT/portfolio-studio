import { FormField, type FormErrors } from '@/common/forms';
import { RichTextEditor } from '@/common/rich-text/RichTextEditor';
import type { CourseFormData } from '@/modules/courses/core/forms';

interface DescriptionFieldProps {
  value: CourseFormData['description'];
  errors: FormErrors<keyof CourseFormData>;
  label: string;
  onChange(value: string): void;
}

export function DescriptionField({
  value,
  errors,
  label,
  onChange,
}: DescriptionFieldProps) {
  return (
    <FormField
      name="description"
      errors={errors}
      htmlFor="description"
      label={label}
      required
    >
      {() => (
        <RichTextEditor
          id="description"
          value={value}
          onChange={onChange}
        />
      )}
    </FormField>
  );
}

