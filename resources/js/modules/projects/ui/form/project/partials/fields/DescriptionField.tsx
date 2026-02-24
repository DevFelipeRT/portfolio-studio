import { FormField, type FormErrors } from '@/common/forms';
import { RichTextEditor } from '@/common/rich-text/RichTextEditor';
import type { ProjectFormData } from '@/modules/projects/core/forms';

interface DescriptionFieldProps {
  value: ProjectFormData['description'];
  errors: FormErrors<keyof ProjectFormData>;
  onChange(value: string): void;
}

export function DescriptionField({
  value,
  errors,
  onChange,
}: DescriptionFieldProps) {
  return (
    <FormField
      name="description"
      errors={errors}
      htmlFor="description"
      label="Description"
      required
    >
      {() => (
        <RichTextEditor id="description" value={value} onChange={onChange} />
      )}
    </FormField>
  );
}

