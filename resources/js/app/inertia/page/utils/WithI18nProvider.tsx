'use client';

import { I18nRuntimeProvider, initializeI18nRuntime } from '@/common/i18n';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import type { InertiaPageProps } from '../../types';
import { resolveInitialLocale } from './locale';
import type { Locale } from '@/common/locale';
import { preloadI18nScopes } from '@/common/i18n';

export type WithI18nProviderOptions = {
  scopeIds?: readonly string[] | null;
};

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
  const scopeIds = options.scopeIds ?? null;

  return (
    <I18nRuntimeProvider>
      <ScopedPreload
        supportedLocales={localizationConfig.supportedLocales}
        initialLocale={currentLocale}
        fallbackLocale={localizationConfig.fallbackLocale ?? null}
        scopeIds={scopeIds}
      />
      {content}
    </I18nRuntimeProvider>
  );
}

function ScopedPreload(props: {
  supportedLocales?: unknown;
  initialLocale: string | null;
  fallbackLocale: string | null;
  scopeIds?: readonly string[] | null;
}) {
  const { supportedLocales, initialLocale, fallbackLocale, scopeIds } = props;

  const runtimeConfig = useMemo(
    () => ({
      supportedLocales,
      defaultLocale: initialLocale,
      fallbackLocale,
    }),
    [supportedLocales, initialLocale, fallbackLocale],
  );

  useEffect(() => {
    void (async () => {
      const { localeResolver, runtimeConfig: normalized } =
        await initializeI18nRuntime(runtimeConfig);
      const resolvedLocale = localeResolver.resolve(
        initialLocale ?? normalized.defaultLocale,
      ) as Locale;
      const resolvedFallback =
        typeof fallbackLocale === 'string' && fallbackLocale.trim() !== ''
          ? (localeResolver.resolve(fallbackLocale) as Locale)
          : null;

      await preloadI18nScopes({
        locale: resolvedLocale,
        fallbackLocale: resolvedFallback,
        scopeIds,
        includeCommon: true,
      });
    })();
  }, [fallbackLocale, initialLocale, runtimeConfig, scopeIds]);

  return null;
}
