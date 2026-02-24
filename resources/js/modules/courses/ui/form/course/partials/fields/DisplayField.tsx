import { FormField, type FormErrors } from '@/common/forms';
import { Checkbox } from '@/components/ui/checkbox';
import type { CourseFormData } from '@/modules/courses/core/forms';

interface DisplayFieldProps {
  value: CourseFormData['display'];
  errors: FormErrors<keyof CourseFormData>;
  processing: boolean;
  label: string;
  onChange(value: boolean): void;
}

export function DisplayField({
  value,
  errors,
  processing,
  label,
  onChange,
}: DisplayFieldProps) {
  return (
    <FormField
      name="display"
      errors={errors}
      htmlFor="display"
      label={label}
      variant="inline"
    >
      {({ a11yAttributes }) => (
        <Checkbox
          id="display"
          checked={value}
          onCheckedChange={(checked) => onChange(!!checked)}
          disabled={processing}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

