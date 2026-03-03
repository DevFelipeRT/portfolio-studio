import {
  I18nProvider,
  createI18nEnvironment,
} from '@/common/i18n';
import type { ReactNode } from 'react';
import type { InertiaPageProps } from '../../types';
import { resolveInitialLocale } from './locale';
import type { Locale } from '@/common/i18n/core/types';
import type { I18nPreloader } from '@/common/i18n';

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

  const { localeResolver, translator, translatorProvider } = createI18nEnvironment({
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
    <I18nProvider
      initialLocale={currentLocale}
      localeResolver={localeResolver}
      translator={translator}
      fallbackLocale={localizationConfig.fallbackLocale ?? null}
      translatorProvider={combinedTranslatorProvider}
      loadingOverlayDelayMs={-1}
    >
      {content}
    </I18nProvider>
  );
}
