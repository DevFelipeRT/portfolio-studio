import { FormField, type FormErrors } from '@/common/forms';
import { DatePicker } from '@/components/ui/date-picker';
import type { CourseFormData } from '@/modules/courses/core/forms';

interface CompletedAtFieldProps {
  value: CourseFormData['completed_at'];
  errors: FormErrors<keyof CourseFormData>;
  processing: boolean;
  locale: string;
  supportedLocales: readonly string[];
  label: string;
  onChange(value: string | null): void;
}

export function CompletedAtField({
  value,
  errors,
  processing,
  locale,
  supportedLocales,
  label,
  onChange,
}: CompletedAtFieldProps) {
  return (
    <FormField
      name="completed_at"
      errors={errors}
      htmlFor="completed_at"
      label={label}
    >
      {({ a11yAttributes, getInputClassName }) => (
        <DatePicker
          key={locale}
          id="completed_at"
          value={value}
          onChange={onChange}
          disabled={processing}
          locale={locale}
          supportedLocales={supportedLocales}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}
