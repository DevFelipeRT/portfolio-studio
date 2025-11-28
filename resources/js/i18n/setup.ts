import { NAMESPACES } from './config/namespaces';
import {
    CatalogSource,
    createStaticCatalogProvider,
} from './core/catalog-provider';
import { createLocaleResolver } from './core/locale-resolver';
import { createTranslationResolver } from './core/translation-resolver';
import {
    Locale,
    Namespace,
    NamespacedCatalog,
    TranslationTree,
} from './core/types';

const namespaceValues = Object.values(NAMESPACES);
const KNOWN_NAMESPACES = new Set<string>(namespaceValues);

/**
 * Eagerly loads all translation modules under i18n/locales.
 * Expected file structure: ./locales/{locale}/{namespace}.ts
 */
const translationModules = import.meta.glob('./locales/*/*.ts', {
    eager: true,
}) as Record<string, { default: TranslationTree }>;

/**
 * Catalog source with all locales and namespaces discovered at build time.
 */
const CATALOG_SOURCE: CatalogSource = buildCatalogSource(translationModules);

/**
 * Shared catalog provider backed by the static catalog source.
 * This part does not depend on runtime configuration.
 */
export const catalogProvider = createStaticCatalogProvider(CATALOG_SOURCE, {
    onMissingCatalog(locale, namespace) {
        if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.warn(
                `[i18n] Missing catalog for locale "${locale}" and namespace "${namespace}".`,
            );
        }
    },
});

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
 * Creates a locale resolver and translation resolver using runtime
 * configuration provided by the back-end (Inertia shared props).
 */
export function createI18nEnvironment(
    runtimeConfig: RuntimeLocalizationConfig,
) {
    const normalized = normalizeRuntimeConfig(runtimeConfig);

    const localeResolver = createLocaleResolver({
        supportedLocales: normalized.supportedLocales,
        defaultLocale: normalized.defaultLocale,
    });

    const translationResolver = createTranslationResolver({
        catalogProvider,
        fallbackLocale: normalized.fallbackLocale,
        onMissingKey(info) {
            if (import.meta.env.DEV) {
                // eslint-disable-next-line no-console
                console.warn(
                    `[i18n] Missing key "${info.namespace}.${info.key}" for locale "${info.locale}".`,
                );
            }
        },
    });

    return {
        localeResolver,
        translationResolver,
    };
}

/**
 * Builds the catalog source from the translation modules discovered by Vite.
 */
function buildCatalogSource(
    modules: Record<string, { default: TranslationTree }>,
): CatalogSource {
    const source: CatalogSource = {};

    for (const [path, mod] of Object.entries(modules)) {
        const match = path.match(/^\.\/locales\/([^/]+)\/([^/]+)\.ts$/);

        if (!match) {
            continue;
        }

        const [, locale, namespace] = match;

        if (!KNOWN_NAMESPACES.has(namespace)) {
            continue;
        }

        const tree = mod.default;

        if (!source[locale]) {
            source[locale] = {} as NamespacedCatalog;
        }

        source[locale][namespace as Namespace] = tree;
    }

    return source;
}

/**
 * Normalizes runtime localization data coming from the back-end.
 * Falls back gracefully when some properties are missing or invalid.
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
