import { FormField, type FormErrors } from '@/common/forms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { InitiativeFormData } from '@/modules/initiatives/core/forms';

interface LocaleFieldProps {
  value: InitiativeFormData['locale'];
  errors: FormErrors<keyof InitiativeFormData>;
  processing: boolean;
  supportedLocales: readonly string[];
  localeDisabled: boolean;
  onChange(value: string): void;
}

export function LocaleField({
  value,
  errors,
  processing,
  supportedLocales,
  localeDisabled,
  onChange,
}: LocaleFieldProps) {
  return (
    <FormField
      name="locale"
      errors={errors}
      htmlFor="locale"
      label="Locale"
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
            <SelectValue placeholder="Select a locale" />
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

