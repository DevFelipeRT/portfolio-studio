import { I18nProvider, createI18nEnvironment } from '@/Common/i18n';
import type { ReactNode } from 'react';
import type { InertiaPageProps } from '../../types';
import { resolveInitialLocale } from './locale';

/**
 * Wraps arbitrary content in the application's I18n provider configured from
 * the current Inertia page props.
 */
export function wrapWithI18nProvider(
  props: InertiaPageProps,
  content: ReactNode,
): ReactNode {
  const currentLocale = resolveInitialLocale(props) ?? null;
  const localizationConfig = props.localization || {};

  const { localeResolver, translationResolver } = createI18nEnvironment({
    supportedLocales: localizationConfig.supportedLocales,
    defaultLocale: currentLocale,
    fallbackLocale: localizationConfig.fallbackLocale,
  });

  return (
    <I18nProvider
      initialLocale={currentLocale}
      localeResolver={localeResolver}
      translationResolver={translationResolver}
    >
      {content}
    </I18nProvider>
  );
}
