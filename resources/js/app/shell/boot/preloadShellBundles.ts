import {
  createInitializedI18nRuntime,
  preloadI18nBundles,
} from '@/common/i18n';
import type { Locale } from '@/common/locale';
import type { AppPageProps } from '../types';
import { resolveAppLocalizationContext } from '../runtime';

/**
 * The shell-bundle preload routine used before the first application mount.
 */
export async function preloadShellBundles(
  initialProps: AppPageProps,
): Promise<void> {
  const localizationContext = resolveAppLocalizationContext(initialProps);
  const currentLocale = localizationContext.currentLocale;

  const { localeResolver, runtimeConfig } = await createInitializedI18nRuntime({
    supportedLocales: localizationContext.supportedLocales,
    defaultLocale: currentLocale,
    fallbackLocale: localizationContext.fallbackLocale,
  });

  const resolvedLocale = localeResolver.resolve(
    currentLocale ?? localeResolver.defaultLocale,
  ) as Locale;
  const resolvedFallbackLocale =
    localizationContext.fallbackLocale
      ? (localeResolver.resolve(localizationContext.fallbackLocale) as Locale)
      : runtimeConfig.fallbackLocale;

  await preloadI18nBundles({
    locale: resolvedLocale,
    fallbackLocale: resolvedFallbackLocale,
    scopeIds: ['layouts'],
    includeCommon: true,
  });
}
