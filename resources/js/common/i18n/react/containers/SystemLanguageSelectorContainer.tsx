'use client';

import { NAMESPACES } from '@/common/i18n/config/namespaces';
import { LanguageSelector } from '@/common/i18n/ui/LanguageSelector';
import { useSetLocale } from '@/common/i18n/react/hooks/useSetLocale';
import { useTranslation } from '@/common/i18n/react/hooks/useTranslation';
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
  const { translate, locale: activeLocale } = useTranslation(NAMESPACES.common);
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
  });

  const ariaLabel = translate(
    'languageSwitcher.ariaLabel',
    `Change language (current: ${activeLocale})`,
    { locale: activeLocale },
  );

  const menuLabel = translate('languageSwitcher.label', 'Language');

  return (
    <LanguageSelector
      activeLocale={activeLocale}
      locales={supportedLocales}
      ariaLabel={ariaLabel}
      menuLabel={menuLabel}
      onSelect={setLocaleAndPersist}
      formatLabel={formatLocaleLabel}
      formatShortLabel={formatLocaleShortLabel}
    />
  );
}

function formatLocaleLabel(code: string): string {
  switch (code) {
    case 'pt_BR':
      return 'Português (Brasil)';
    case 'en':
      return 'English';
    default:
      return code;
  }
}

function formatLocaleShortLabel(code: string): string {
  switch (code) {
    case 'pt_BR':
      return 'pt_BR';
    case 'en':
      return 'en';
    default:
      return code;
  }
}
