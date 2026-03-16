import type { AppPageProps } from '@/app/shell';
import type { FormErrors } from '@/common/forms/types';
import { resolveFieldErrorMessage } from '@/common/forms/field/error/fieldErrorMessage';
import { usePageProps } from '@/common/page-runtime';
import React from 'react';

type UseFormLocaleFieldInput = {
  value: string;
  locales: readonly string[];
  errors: FormErrors<string>;
  disabled?: boolean;
  errorId?: string;
  onChange(locale: string): void;
};

export type FormLocaleFieldState = {
  value: string;
  disabled: boolean;
  error: string | null;
  errorId: string;
  onChange(locale: string): void;
};

/**
 * useFormLocaleField centralizes locale rules for forms whose content will be
 * displayed on the public website.
 *
 * Locale sources must match public pages:
 * - base: `props.localization.currentLocale`
 * - fallback: `props.localization.defaultLocale`
 * - system fallback: 'en'
 *
 * Supported locales remain a form/domain responsibility and must be provided.
 */
export function useFormLocaleField({
  value,
  locales,
  errors,
  disabled = false,
  errorId = 'locale-error',
  onChange,
}: UseFormLocaleFieldInput): FormLocaleFieldState {
  const page = usePageProps<AppPageProps>();

  const initialLocale = React.useMemo(() => {
    const candidate =
      page.localization?.currentLocale?.trim() ||
      page.localization?.defaultLocale?.trim() ||
      'en';

    if (locales.includes(candidate)) {
      return candidate;
    }

    return locales[0] ?? candidate;
  }, [
    page.localization?.currentLocale,
    page.localization?.defaultLocale,
    locales,
  ]);

  React.useEffect(() => {
    if (!value?.trim() && initialLocale) {
      onChange(initialLocale);
    }
  }, [initialLocale, onChange, value]);

  const resolvedValue = value?.trim() ? value : initialLocale;
  const error = resolveFieldErrorMessage(errors, 'locale');

  return {
    value: resolvedValue,
    disabled,
    error,
    errorId,
    onChange,
  };
}
