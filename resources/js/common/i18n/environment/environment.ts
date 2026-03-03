import { createLocaleResolver } from '../core/locale';
import {
    createTranslatorProviderFromLoaders,
    type MissingPathInfo,
    type TranslatorFactoryConfig,
    type TranslatorProvider,
} from '../core/translation';
import { translationModuleLoaders } from './translationModuleLoaders';
import {
    type NormalizedRuntimeLocalizationConfig,
    type RuntimeLocalizationConfig,
    normalizeRuntimeConfig,
} from './runtimeConfig';

/**
 * Default app-wide provider, backed by Vite glob loaders.
 */
export const translatorProvider: TranslatorProvider =
    createTranslatorProviderFromLoaders(translationModuleLoaders);

/**
 * Back-compat export: the provider also implements the catalog methods used by
 * the previous API surface.
 */
export const catalogProvider = translatorProvider;

/**
 * Instantiates the locale resolver and a configured Translator based on runtime configuration.
 */
export function createI18nEnvironment(runtimeConfig: RuntimeLocalizationConfig) {
    const normalized: NormalizedRuntimeLocalizationConfig =
        normalizeRuntimeConfig(runtimeConfig);

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

