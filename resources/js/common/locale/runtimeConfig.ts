import { canonicalizeLocale } from './canonicalizers/localeCanonicalizer';
import { canonicalizeSupportedLocales } from './supportedLocalesList';
import type { Locale } from './types';

export type RuntimeLocalizationConfig = {
  supportedLocales?: unknown;
  defaultLocale?: unknown;
  fallbackLocale?: unknown;
};

export type NormalizedRuntimeLocalizationConfig = {
  supportedLocales: Locale[];
  defaultLocale: Locale;
  fallbackLocale: Locale;
};

/**
 * Normalizes backend-provided configuration, ensuring canonical fallback values.
 */
export function normalizeRuntimeConfig(
  runtimeConfig: RuntimeLocalizationConfig,
): NormalizedRuntimeLocalizationConfig {
  const rawDefaultLocale =
    typeof runtimeConfig.defaultLocale === 'string'
      ? runtimeConfig.defaultLocale
      : '';
  const defaultLocale =
    canonicalizeLocale(rawDefaultLocale) ?? ('en' as Locale);

  const rawSupportedLocales = Array.isArray(runtimeConfig.supportedLocales)
    ? runtimeConfig.supportedLocales.filter(
        (value): value is string => typeof value === 'string',
      )
    : [];
  const supportedLocales = [
    ...canonicalizeSupportedLocales(rawSupportedLocales, defaultLocale),
  ];

  const rawFallbackLocale =
    typeof runtimeConfig.fallbackLocale === 'string'
      ? runtimeConfig.fallbackLocale
      : '';
  const canonicalFallbackLocale = canonicalizeLocale(rawFallbackLocale);
  const fallbackLocale =
    canonicalFallbackLocale &&
    supportedLocales.includes(canonicalFallbackLocale)
      ? canonicalFallbackLocale
      : defaultLocale;

  return {
    supportedLocales,
    defaultLocale,
    fallbackLocale,
  };
}
