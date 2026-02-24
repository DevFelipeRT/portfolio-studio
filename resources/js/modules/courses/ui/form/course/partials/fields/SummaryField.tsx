import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import type { CourseFormData } from '@/modules/courses/core/forms';

interface SummaryFieldProps {
  value: CourseFormData['summary'];
  errors: FormErrors<keyof CourseFormData>;
  processing: boolean;
  label: string;
  placeholder: string;
  onChange(value: string): void;
}

export function SummaryField({
  value,
  errors,
  processing,
  label,
  placeholder,
  onChange,
}: SummaryFieldProps) {
  return (
    <FormField
      name="summary"
      errors={errors}
      htmlFor="summary"
      label={label}
      required
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id="summary"
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

