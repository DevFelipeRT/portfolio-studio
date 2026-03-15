import { createLocaleResolver, normalizeRuntimeConfig } from '@/common/locale';
import type {
  RuntimeLocalizationConfig,
  NormalizedRuntimeLocalizationConfig,
} from '@/common/locale';
import { ensureI18nextInitialized } from './i18next/i18next';

export type I18nRuntime = {
  localeResolver: ReturnType<typeof createLocaleResolver>;
  runtimeConfig: NormalizedRuntimeLocalizationConfig;
};

/**
 * Creates the normalized i18n runtime contract used by application boot and
 * page-level runtime setup.
 */
export async function createI18nRuntime(
  runtimeConfig: RuntimeLocalizationConfig,
): Promise<I18nRuntime> {
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
