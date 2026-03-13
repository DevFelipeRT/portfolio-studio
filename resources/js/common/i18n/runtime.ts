import { createLocaleResolver, normalizeRuntimeConfig } from '@/common/locale';
import type {
  Locale,
  RuntimeLocalizationConfig,
  NormalizedRuntimeLocalizationConfig,
} from '@/common/locale';
import { ensureI18nextInitialized, getI18next } from './i18next/i18next';

export type InitializedI18nRuntime = {
  localeResolver: ReturnType<typeof createLocaleResolver>;
  runtimeConfig: NormalizedRuntimeLocalizationConfig;
};

export async function initializeI18nRuntime(
  runtimeConfig: RuntimeLocalizationConfig,
): Promise<InitializedI18nRuntime> {
  const normalized = normalizeRuntimeConfig(runtimeConfig);

  await ensureI18nextInitialized({
    locale: normalized.defaultLocale,
    fallbackLocale: normalized.fallbackLocale,
    supportedLocales: normalized.supportedLocales,
  });

  const localeResolver = createLocaleResolver({
    supportedLocales: normalized.supportedLocales,
    defaultLocale: normalized.defaultLocale,
  });

  return {
    localeResolver,
    runtimeConfig: normalized,
  };
}

export function getI18nRuntime() {
  return getI18next();
}

export async function setI18nRuntimeLocale(locale: Locale | string): Promise<string> {
  const trimmed = String(locale).trim();
  if (!trimmed) {
    return trimmed;
  }

  await getI18nRuntime().changeLanguage(trimmed);
  return trimmed;
}
