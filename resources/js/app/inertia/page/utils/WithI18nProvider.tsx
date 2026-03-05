'use client';

import {
  createI18nEnvironment,
} from '@/common/i18n';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import type { InertiaPageProps } from '../../types';
import { resolveInitialLocale } from './locale';
import type { Locale } from '@/common/locale';
import type { I18nPreloader } from '@/common/i18n';
import { I18nextProvider } from 'react-i18next';
import { getI18next } from '@/common/i18n/i18next/i18next';

export type WithI18nProviderOptions = { i18nPreloader?: I18nPreloader | null };

/**
 * Wraps arbitrary content in the application's I18n provider configured from
 * the current Inertia page props.
 */
export function wrapWithI18nProvider(
  props: InertiaPageProps,
  content: ReactNode,
  options: WithI18nProviderOptions = {},
): ReactNode {
  const currentLocale = resolveInitialLocale(props) ?? null;
  const localizationConfig = props.localization || {};

  const { localeResolver, translatorProvider } = createI18nEnvironment({
    supportedLocales: localizationConfig.supportedLocales,
    defaultLocale: currentLocale,
    fallbackLocale: localizationConfig.fallbackLocale,
  });

  const i18nPreloader = options.i18nPreloader ?? null;

  const combinedTranslatorProvider = {
    preloadLocale: async (locale: Locale) => {
      await Promise.all([
        translatorProvider.preloadLocale?.(locale),
        i18nPreloader?.preloadLocale?.(locale),
      ]);
    },
  };

  return (
    <I18nextProvider i18n={getI18next()}>
      <ScopedPreload
        localeResolver={localeResolver}
        initialLocale={currentLocale}
        fallbackLocale={localizationConfig.fallbackLocale ?? null}
        translatorProvider={combinedTranslatorProvider}
      />
      {content}
    </I18nextProvider>
  );
}

function ScopedPreload(props: {
  localeResolver: ReturnType<typeof createI18nEnvironment>['localeResolver'];
  initialLocale: string | null;
  fallbackLocale: string | null;
  translatorProvider: { preloadLocale(locale: Locale): Promise<void> };
}) {
  const { localeResolver, initialLocale, fallbackLocale, translatorProvider } =
    props;

  const resolvedLocale = useMemo(
    () =>
      localeResolver.resolve(initialLocale ?? localeResolver.defaultLocale),
    [localeResolver, initialLocale],
  );

  const resolvedFallback = useMemo(() => {
    if (!fallbackLocale) {
      return null;
    }
    return localeResolver.resolve(fallbackLocale);
  }, [localeResolver, fallbackLocale]);

  useEffect(() => {
    void translatorProvider.preloadLocale(resolvedLocale);
    if (resolvedFallback && resolvedFallback !== resolvedLocale) {
      void translatorProvider.preloadLocale(resolvedFallback);
    }
  }, [translatorProvider, resolvedLocale, resolvedFallback]);

  return null;
}
