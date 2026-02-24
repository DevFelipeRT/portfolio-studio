import { FormField, type FormErrors } from '@/common/forms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ProjectFormData } from '@/modules/projects/core/forms';

interface LocaleFieldProps {
  value: ProjectFormData['locale'];
  errors: FormErrors<keyof ProjectFormData>;
  processing: boolean;
  supportedLocales: readonly string[];
  localeDisabled: boolean;
  label: string;
  placeholder: string;
  onChange(value: string): void;
}

export function LocaleField({
  value,
  errors,
  processing,
  supportedLocales,
  localeDisabled,
  label,
  placeholder,
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
          disabled={processing || localeDisabled}
        >
          <SelectTrigger
            id="locale"
            className={getSelectClassName()}
            {...a11yAttributes}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {supportedLocales.map((locale) => (
              <SelectItem key={locale} value={locale}>
                {locale}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
}

