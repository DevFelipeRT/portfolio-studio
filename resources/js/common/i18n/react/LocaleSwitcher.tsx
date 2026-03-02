'use client';

import { LanguageSelector } from './LanguageSelector';
import { useSetLocale } from '@/common/i18n/react/hooks/useSetLocale';
import { usePage } from '@inertiajs/react';

type LocalizationProps = {
  currentLocale?: string;
  supportedLocales?: string[];
  defaultLocale?: string;
  fallbackLocale?: string;
  cookieName?: string;
  apiEndpoint?: string;
  persistClientCookie?: boolean;
};

type SharedProps = {
  localization?: LocalizationProps;
};

type LocaleSwitcherProps = {
  cookieName?: string;
  apiEndpoint?: string;
  persistClientCookie?: boolean;
  maxAgeDays?: number;
  reloadDelayMs?: number;
  variant?: 'auto' | 'label' | 'short' | 'labelAndShort' | 'ghost';
  disabled?: boolean;
};

/**
 * LocaleSwitcher wires Inertia-provided localization props + persistence behavior
 * to the LanguageSelector UI.
 *
 * The backend decides the "public vs system" behavior per route by providing
 * different `props.localization` values (cookie name, API endpoint, etc.).
 */
export function LocaleSwitcher({
  cookieName,
  apiEndpoint,
  persistClientCookie,
  maxAgeDays = 30,
  reloadDelayMs = 400,
  variant = 'short',
  disabled = false,
}: LocaleSwitcherProps) {
  const page = usePage().props as SharedProps;

  const localization = page.localization ?? {};
  const supportedLocales = localization.supportedLocales ?? [];
  const resolvedCookieName = cookieName ?? localization.cookieName ?? 'locale';
  const resolvedApiEndpoint =
    apiEndpoint ?? localization.apiEndpoint ?? '/set-locale';
  const resolvedPersistClientCookie =
    persistClientCookie ?? localization.persistClientCookie ?? true;

  const setLocaleAndPersist = useSetLocale({
    cookieName: resolvedCookieName,
    maxAgeDays,
    apiEndpoint: resolvedApiEndpoint,
    persistClientCookie: resolvedPersistClientCookie,
    reloadDelayMs,
  });

  return (
    <LanguageSelector
      locales={supportedLocales}
      onSelect={setLocaleAndPersist}
      variant={variant}
      disabled={disabled}
    />
  );
}
