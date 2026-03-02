import { FieldError } from '@/common/forms/field/error/FieldError';
import { useFormLocaleField } from '@/common/forms/field/useFormLocaleField';
import type { FormErrors } from '@/common/forms/types';
import { LanguageSelector } from '@/common/i18n';

export type FormLocaleFieldProps = {
  value: string;
  locales: readonly string[];
  errors: FormErrors<string>;
  disabled?: boolean;
  errorId?: string;
  onChange(locale: string): void;
};

export function FormLocaleField({
  value,
  locales,
  errors,
  disabled = false,
  errorId,
  onChange,
}: FormLocaleFieldProps) {
  const resolved = useFormLocaleField({
    value,
    locales,
    errors,
    disabled,
    errorId,
    onChange,
  });

  const activeLocale = resolved.value?.trim();
  if (!activeLocale || !locales.length) return null;

  return (
    <div className="space-y-1 text-right">
      <div className="flex justify-end">
        <LanguageSelector
          activeLocale={activeLocale}
          locales={Array.from(locales)}
          onSelect={resolved.onChange}
          disabled={resolved.disabled}
        />
      </div>
      <FieldError
        id={resolved.errorId}
        message={resolved.error ?? null}
        className="text-xs"
      />
    </div>
  );
}
