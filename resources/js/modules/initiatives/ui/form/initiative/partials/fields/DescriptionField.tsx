import { FormField, type FormErrors } from '@/common/forms';
import { RichTextEditor } from '@/common/rich-text/RichTextEditor';
import type { InitiativeFormData } from '@/modules/initiatives/core/forms';

interface DescriptionFieldProps {
  value: InitiativeFormData['description'];
  errors: FormErrors<keyof InitiativeFormData>;
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

