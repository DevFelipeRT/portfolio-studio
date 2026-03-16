'use client';

import {
  I18nRuntimeProvider,
  createInitializedI18nRuntime,
  preloadI18nBundles,
} from '@/common/i18n';
import type { Locale } from '@/common/locale';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import type { AppLocalizationContext, AppPageProps } from '../types';
import { resolveAppLocalizationContext } from '../runtime';

/**
 * The provider options used while wrapping page content with shell-level React
 * providers.
 */
export type WrapWithShellProvidersOptions = {
  scopeIds?: readonly string[] | null;
};

/**
 * The shell provider wrapper that supplies the runtime i18n provider and
 * scope-aware preload behavior for decorated pages.
 */
export function wrapWithShellProviders(
  props: AppPageProps,
  content: ReactNode,
  options: WrapWithShellProvidersOptions = {},
): ReactNode {
  const scopeIds = options.scopeIds ?? null;
  const localizationContext = resolveAppLocalizationContext(props);

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

/**
 * The scoped-preload companion component used by the shell provider wrapper.
 */
function ScopedPreload(props: {
  localizationContext: AppLocalizationContext;
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
        await createInitializedI18nRuntime(runtimeConfig);
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
