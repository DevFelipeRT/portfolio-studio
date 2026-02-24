import { FormField, type FormErrors } from '@/common/forms';
import { useSupportedLocales } from '@/common/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SkillFormData } from '@/modules/skills/core/forms';

interface LocaleFieldProps {
  value: SkillFormData['locale'];
  errors: FormErrors<keyof SkillFormData>;
  processing: boolean;
  onChange(value: string): void;
}

export function LocaleField({
  value,
  errors,
  processing,
  onChange,
}: LocaleFieldProps) {
  const supportedLocales = useSupportedLocales();

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
          disabled={processing}
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

