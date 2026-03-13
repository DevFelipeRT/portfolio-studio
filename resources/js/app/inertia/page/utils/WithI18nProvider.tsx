'use client';

import { I18nRuntimeProvider, initializeI18nRuntime } from '@/common/i18n';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import type {
  InertiaLocalizationContext,
  InertiaPageProps,
} from '../../types';
import type { Locale } from '@/common/locale';
import { preloadI18nBundles } from '@/common/i18n';
import { resolveInertiaLocalizationContext } from '../../runtime';

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
  const scopeIds = options.scopeIds ?? null;
  const localizationContext = resolveInertiaLocalizationContext(props);

  return (
    <I18nRuntimeProvider>
      <ScopedPreload
        localizationContext={localizationContext}
        scopeIds={scopeIds}
      />
      {content}
    </I18nRuntimeProvider>
  );
}

function ScopedPreload(props: {
  localizationContext: InertiaLocalizationContext;
  scopeIds?: readonly string[] | null;
}) {
  const { localizationContext, scopeIds } = props;
  const { currentLocale, fallbackLocale, supportedLocales } =
    localizationContext;

  const runtimeConfig = useMemo(
    () => ({
      supportedLocales,
      defaultLocale: currentLocale,
      fallbackLocale,
    }),
    [supportedLocales, currentLocale, fallbackLocale],
  );

  useEffect(() => {
    void (async () => {
      const { localeResolver, runtimeConfig: normalized } =
        await initializeI18nRuntime(runtimeConfig);
      const resolvedLocale = localeResolver.resolve(
        currentLocale ?? normalized.defaultLocale,
      ) as Locale;
      const resolvedFallback =
        fallbackLocale
          ? (localeResolver.resolve(fallbackLocale) as Locale)
          : null;

      await preloadI18nBundles({
        locale: resolvedLocale,
        fallbackLocale: resolvedFallback,
        scopeIds,
        includeCommon: true,
      });
    })();
  }, [currentLocale, fallbackLocale, runtimeConfig, scopeIds]);

  return null;
}
