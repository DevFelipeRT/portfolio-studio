import { createLocaleResolver } from './core/locale';
import type { Locale } from './core/types';
import {
    createTranslatorProviderFromLoaders,
    type MissingPathInfo,
    type TranslatorFactoryConfig,
    type TranslatorProvider,
    type TranslationModuleLoaders,
} from './core/translation';

/**
 * Default app-wide translation loaders.
 *
 * Structure convention:
 * - ./locales/{locale}/{namespace}.ts
 * - ../../modules/<any>/locales/{locale}/{namespace}.ts
 */
const translationModuleLoaders = {
    ...import.meta.glob('./locales/*/*.ts'),
    ...import.meta.glob('../../modules/**/locales/*/*.ts'),
} as TranslationModuleLoaders;

/**
 * Default app-wide provider, backed by Vite glob loaders.
 *
 * Domains that want a different internal namespace organization can create their
 * own provider via `createTranslatorProviderFromLoaders(...)`.
 */
export const translatorProvider: TranslatorProvider =
    createTranslatorProviderFromLoaders(translationModuleLoaders);

/**
 * Back-compat export: the provider also implements the catalog methods used by
 * the previous API surface.
 */
export const catalogProvider = translatorProvider;

export type RuntimeLocalizationConfig = {
    supportedLocales?: unknown;
    defaultLocale?: unknown;
    fallbackLocale?: unknown;
};

type NormalizedRuntimeLocalizationConfig = {
    supportedLocales: Locale[];
    defaultLocale: Locale;
    fallbackLocale: Locale;
};

/**
 * Normalizes backend-provided configuration, ensuring valid fallback values.
 */
function normalizeRuntimeConfig(
    runtimeConfig: RuntimeLocalizationConfig,
): NormalizedRuntimeLocalizationConfig {
    const rawSupported = Array.isArray(runtimeConfig.supportedLocales)
        ? runtimeConfig.supportedLocales
        : [];

    const supportedLocales: Locale[] = rawSupported
        .filter((value): value is string => typeof value === 'string')
        .map((value) => value.trim())
        .filter((value): value is Locale => value.length > 0);

    let defaultLocale: Locale = 'en' as Locale;
    if (
        typeof runtimeConfig.defaultLocale === 'string' &&
        runtimeConfig.defaultLocale.trim() !== ''
    ) {
        defaultLocale = runtimeConfig.defaultLocale.trim() as Locale;
    }

    let fallbackLocale: Locale = defaultLocale;
    if (
        typeof runtimeConfig.fallbackLocale === 'string' &&
        runtimeConfig.fallbackLocale.trim() !== ''
    ) {
        fallbackLocale = runtimeConfig.fallbackLocale.trim() as Locale;
    }

    return {
        supportedLocales,
        defaultLocale,
        fallbackLocale,
    };
}

/**
 * Instantiates the locale resolver and a configured Translator based on runtime configuration.
 */
export function createI18nEnvironment(runtimeConfig: RuntimeLocalizationConfig) {
    const normalized = normalizeRuntimeConfig(runtimeConfig);

    const localeResolver = createLocaleResolver({
        supportedLocales: normalized.supportedLocales,
        defaultLocale: normalized.defaultLocale,
    });

    const translatorConfig: TranslatorFactoryConfig = {
        fallbackLocale: normalized.fallbackLocale,
        onMissingKey(info: MissingPathInfo) {
            if (import.meta.env.DEV) {
                // eslint-disable-next-line no-console
                console.warn(
                    `[i18n] Missing key "${info.namespace}.${info.path}" for locale "${info.locale}".`,
                );
            }
        },
    };

    const translator = translatorProvider.createTranslator(translatorConfig);

    return {
        localeResolver,
        translator,
        translatorProvider,
    };
}
