'use client';

import { LanguageSelector } from '@/common/i18n/react/LanguageSelector';
import { useSetLocale } from './useSetLocale';
import { useSupportedLocales } from './useSupportedLocales';

type LocalizationProps = {
  currentLocale?: string;
  supportedLocales?: string[];
  defaultLocale?: string;
  fallbackLocale?: string;
  cookieName?: string;
  apiEndpoint?: string;
  persistClientCookie?: boolean;
};

export type LocaleSwitcherProps = {
  localization?: LocalizationProps;
  reload?(pathname: string): void;
  cookieName?: string;
  apiEndpoint?: string;
  persistClientCookie?: boolean;
  maxAgeDays?: number;
  reloadDelayMs?: number;
  applyLocaleState?: boolean;
  variant?: 'auto' | 'label' | 'short' | 'labelAndShort' | 'ghost';
  disabled?: boolean;
};

/**
 * Binds locale selection UI to the locale persistence hook.
 *
 * `localization` provides optional defaults for the persistence configuration.
 * `reload`, when provided, is used to reload the current page after persistence.
 */
export function LocaleSwitcher({
  localization,
  reload,
  cookieName,
  apiEndpoint,
  persistClientCookie,
  maxAgeDays = 30,
  reloadDelayMs = 400,
  applyLocaleState,
  variant = 'short',
  disabled = false,
}: LocaleSwitcherProps) {
  const resolvedLocalization = localization ?? {};
  const supportedLocales = useSupportedLocales();
  const supportedLocalesFromProps = resolvedLocalization.supportedLocales;
  const resolvedSupportedLocales =
    supportedLocalesFromProps && supportedLocalesFromProps.length > 0
      ? supportedLocalesFromProps
      : supportedLocales;
  const resolvedCookieName =
    cookieName ?? resolvedLocalization.cookieName ?? 'locale';
  const resolvedApiEndpoint =
    apiEndpoint ?? resolvedLocalization.apiEndpoint ?? '/set-locale';
  const resolvedPersistClientCookie =
    persistClientCookie ?? resolvedLocalization.persistClientCookie ?? true;

  const setLocaleAndPersist = useSetLocale({
    cookieName: resolvedCookieName,
    maxAgeDays,
    apiEndpoint: resolvedApiEndpoint,
    persistClientCookie: resolvedPersistClientCookie,
    reload,
    reloadDelayMs,
    ...(applyLocaleState === undefined ? {} : { applyLocaleState }),
  });

  return (
    <LanguageSelector
      locales={resolvedSupportedLocales}
      onSelect={setLocaleAndPersist}
      variant={variant}
      disabled={disabled}
    />
  );
}
