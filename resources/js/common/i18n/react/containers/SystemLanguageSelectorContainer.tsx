'use client';

import { LanguageSelector } from '@/common/i18n/LanguageSelector';
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

type SystemLanguageSelectorContainerProps = {
  cookieName?: string;
  maxAgeDays?: number;
};

/**
 * SystemLanguageSelectorContainer wires the system locale behavior
 * (admin/private scope) to the LanguageSelector UI.
 */
export function SystemLanguageSelectorContainer({
  cookieName,
  maxAgeDays = 30,
}: SystemLanguageSelectorContainerProps) {
  const page = usePage().props as SharedProps;

  const localization = page.localization ?? {};
  const supportedLocales = localization.supportedLocales ?? [];
  const resolvedCookieName = cookieName ?? localization.cookieName ?? 'locale';
  const resolvedApiEndpoint = localization.apiEndpoint ?? '/set-locale';
  const persistClientCookie = localization.persistClientCookie ?? true;

  const setLocaleAndPersist = useSetLocale({
    cookieName: resolvedCookieName,
    maxAgeDays,
    apiEndpoint: resolvedApiEndpoint,
    persistClientCookie,
    reloadDelayMs: 400,
  });

  return (
    <LanguageSelector
      locales={supportedLocales}
      onSelect={setLocaleAndPersist}
      variant="short"
    />
  );
}
