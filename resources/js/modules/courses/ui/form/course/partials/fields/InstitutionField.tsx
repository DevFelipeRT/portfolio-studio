import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { CourseFormData } from '@/modules/courses/core/forms';

interface InstitutionFieldProps {
  value: CourseFormData['institution'];
  errors: FormErrors<keyof CourseFormData>;
  processing: boolean;
  label: string;
  placeholder: string;
  onChange(value: string): void;
}

export function InstitutionField({
  value,
  errors,
  processing,
  label,
  placeholder,
  onChange,
}: InstitutionFieldProps) {
  return (
    <FormField
      name="institution"
      errors={errors}
      htmlFor="institution"
      label={label}
      required
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="institution"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={processing}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

