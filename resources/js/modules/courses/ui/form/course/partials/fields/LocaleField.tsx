import { FormField, type FormErrors } from '@/common/forms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CourseFormData } from '@/modules/courses/core/forms';

interface LocaleFieldProps {
  value: CourseFormData['locale'];
  errors: FormErrors<keyof CourseFormData>;
  processing: boolean;
  disabled: boolean;
  label: string;
  placeholder: string;
  supportedLocales: readonly string[];
  onChange(value: string): void;
}

export function LocaleField({
  value,
  errors,
  processing,
  disabled,
  label,
  placeholder,
  supportedLocales,
  onChange,
}: LocaleFieldProps) {
  return (
    <FormField
      name="locale"
      errors={errors}
      htmlFor="locale"
      label={label}
      required
    >
      {({ a11yAttributes, getSelectClassName }) => (
        <Select
          value={value}
          onValueChange={onChange}
          disabled={processing || disabled}
        >
          <SelectTrigger
            id="locale"
            className={getSelectClassName()}
            {...a11yAttributes}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {supportedLocales.map((supportedLocale) => (
              <SelectItem key={supportedLocale} value={supportedLocale}>
                {supportedLocale}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
}
