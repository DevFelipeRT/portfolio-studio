import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { CourseFormData } from '@/modules/courses/core/forms';

interface NameFieldProps {
  value: CourseFormData['name'];
  errors: FormErrors<keyof CourseFormData>;
  processing: boolean;
  label: string;
  placeholder: string;
  onChange(value: string): void;
}

export function NameField({
  value,
  errors,
  processing,
  label,
  placeholder,
  onChange,
}: NameFieldProps) {
  return (
    <FormField name="name" errors={errors} htmlFor="name" label={label} required>
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="name"
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

