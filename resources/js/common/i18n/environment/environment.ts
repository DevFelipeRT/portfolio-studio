import { createLocaleResolver, normalizeRuntimeConfig } from '@/common/locale';
import type { Locale } from '@/common/locale';
import { translationModuleLoaders } from './translationModuleLoaders';
import type {
    NormalizedRuntimeLocalizationConfig,
    RuntimeLocalizationConfig,
} from '@/common/locale';
import { ensureI18nextInitialized } from '../i18next/i18next';
import { createI18nextPreloaderFromLoaders } from '../i18next/preloaderFromLoaders';

/**
 * Default app-wide preloader for shared catalogs (`common.*`), backed by Vite glob loaders.
 */
export const translatorProvider: {
    preloadLocale(locale: Locale): Promise<void>;
} = {
    preloadLocale: createI18nextPreloaderFromLoaders('common', translationModuleLoaders)
        .preloadLocale!,
};

/**
 * Instantiates the locale resolver and initializes i18next runtime configuration.
 */
export function createI18nEnvironment(runtimeConfig: RuntimeLocalizationConfig) {
    const normalized: NormalizedRuntimeLocalizationConfig =
        normalizeRuntimeConfig(runtimeConfig);

    void ensureI18nextInitialized({
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
        translatorProvider,
    };
}
