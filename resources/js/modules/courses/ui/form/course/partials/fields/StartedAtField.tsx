import { FormField, type FormErrors } from '@/common/forms';
import { DatePicker } from '@/components/ui/date-picker';
import type { CourseFormData } from '@/modules/courses/core/forms';

interface StartedAtFieldProps {
  value: CourseFormData['started_at'];
  errors: FormErrors<keyof CourseFormData>;
  processing: boolean;
  locale: string;
  supportedLocales: readonly string[];
  label: string;
  onChange(value: string | null): void;
}

export function StartedAtField({
  value,
  errors,
  processing,
  locale,
  supportedLocales,
  label,
  onChange,
}: StartedAtFieldProps) {
  return (
    <FormField
      name="started_at"
      errors={errors}
      htmlFor="started_at"
      label={label}
      required
    >
      {({ a11yAttributes, getInputClassName }) => (
        <DatePicker
          key={locale}
          id="started_at"
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
