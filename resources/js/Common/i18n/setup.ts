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
 * Eagerly loads all translation modules.
 * Assumes a structure of: ./locales/{locale}/{namespace}.ts
 */
const translationModules = {
    ...import.meta.glob('./locales/*/*.ts', { eager: true }),
    ...import.meta.glob('../../Modules/**/locales/*/*.ts', { eager: true }),
} as Record<string, { default: TranslationTree }>;

/**
 * Parses file paths to construct the translation catalog.
 * Uses path splitting instead of regex for better resilience against directory changes.
 */
function buildCatalogSource(
    modules: Record<string, { default: TranslationTree }>,
): CatalogSource {
    const source: CatalogSource = {};

    for (const [path, mod] of Object.entries(modules)) {
        const parts = path.split('/');
        const fileName = parts.pop();
        const folderName = parts.pop();

        if (!fileName || !folderName) {
            continue;
        }

        const namespace = fileName.replace('.ts', '');
        const locale = folderName;

        if (!KNOWN_NAMESPACES.has(namespace)) {
            if (import.meta.env.DEV) {
                // eslint-disable-next-line no-console
                console.warn(
                    `[i18n] Skipped unknown namespace "${namespace}" found in ${path}`,
                );
            }
            continue;
        }

        if (!source[locale]) {
            source[locale] = {} as NamespacedCatalog;
        }

        source[locale][namespace as Namespace] = mod.default;
    }

    return source;
}

const CATALOG_SOURCE: CatalogSource = buildCatalogSource(translationModules);

/**
 * Static provider initialized with all available translations at build time.
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
 * Instantiates the locale and translation resolvers based on runtime configuration.
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
