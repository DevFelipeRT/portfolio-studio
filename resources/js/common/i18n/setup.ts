import { NAMESPACES } from './config/namespaces';
import { createLocaleResolver } from './core/localeResolver';
import { createTranslationResolver } from './core/translationResolver';
import {
    Locale,
    Namespace,
    NamespacedCatalog,
    TranslationTree,
} from './core/types';

const namespaceValues = Object.values(NAMESPACES);
const KNOWN_NAMESPACES = new Set<string>(namespaceValues);

/**
 * Loads translation modules on-demand to avoid bundling every locale into the
 * initial JavaScript payload.
 *
 * Assumes a structure of:
 * - ./locales/{locale}/{namespace}.ts
 * - ../../modules/<any>/locales/{locale}/{namespace}.ts
 */
const translationModuleLoaders = {
    ...import.meta.glob('./locales/*/*.ts'),
    ...import.meta.glob('../../modules/**/locales/*/*.ts'),
} as Record<string, () => Promise<{ default: TranslationTree }>>;

type TranslationModuleMeta = {
    locale: Locale;
    namespace: Namespace;
};

function parseTranslationModulePath(
    modulePath: string,
): TranslationModuleMeta | null {
    const parts = modulePath.split('/');
    const fileName = parts.pop();
    const folderName = parts.pop();

    if (!fileName || !folderName) {
        return null;
    }

    const namespace = fileName.replace('.ts', '');
    const locale = folderName;

    if (!KNOWN_NAMESPACES.has(namespace)) {
        if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.warn(
                `[i18n] Skipped unknown namespace "${namespace}" found in ${modulePath}`,
            );
        }
        return null;
    }

    return {
        locale: locale as Locale,
        namespace: namespace as Namespace,
    };
}

type LocaleLoaderEntry = {
    namespace: Namespace;
    loader: () => Promise<{ default: TranslationTree }>;
};

const loadersByLocale = new Map<Locale, LocaleLoaderEntry[]>();
const namespacesByLocale = new Map<Locale, Set<Namespace>>();

Object.entries(translationModuleLoaders).forEach(([modulePath, loader]) => {
    const meta = parseTranslationModulePath(modulePath);
    if (!meta) {
        return;
    }

    const entries = loadersByLocale.get(meta.locale) ?? [];
    entries.push({ namespace: meta.namespace, loader });
    loadersByLocale.set(meta.locale, entries);

    const namespaces = namespacesByLocale.get(meta.locale) ?? new Set<Namespace>();
    namespaces.add(meta.namespace);
    namespacesByLocale.set(meta.locale, namespaces);
});

const supportedLocales = Object.freeze(Array.from(loadersByLocale.keys()));
const loadedCatalogs: Partial<Record<Locale, NamespacedCatalog>> = {};
const localeLoadPromises = new Map<Locale, Promise<void>>();

async function preloadLocale(locale: Locale): Promise<void> {
    if (loadedCatalogs[locale]) {
        return;
    }

    const inFlight = localeLoadPromises.get(locale);
    if (inFlight) {
        return inFlight;
    }

    const entries = loadersByLocale.get(locale) ?? [];

    const promise = Promise.all(
        entries.map(async ({ namespace, loader }) => {
            const mod = await loader();
            return [namespace, mod.default] as const;
        }),
    )
        .then((pairs) => {
            const catalog: NamespacedCatalog = {} as NamespacedCatalog;
            pairs.forEach(([namespace, tree]) => {
                catalog[namespace] = tree;
            });
            loadedCatalogs[locale] = catalog;
        })
        .finally(() => {
            localeLoadPromises.delete(locale);
        });

    localeLoadPromises.set(locale, promise);
    return promise;
}

/**
 * Catalog provider that serves translations from an in-memory cache populated via
 * `preloadLocale`. Translation lookup stays synchronous.
 */
export type PreloadableCatalogProvider = ReturnType<typeof createCatalogProvider> & {
    preloadLocale(locale: Locale): Promise<void>;
};

function createCatalogProvider() {
    return {
        getSupportedLocales(): readonly Locale[] {
            return supportedLocales;
        },
        getNamespaces(locale: Locale): readonly Namespace[] {
            const namespaces = namespacesByLocale.get(locale);
            if (!namespaces) {
                return [];
            }
            return Array.from(namespaces);
        },
        getCatalog(locale: Locale, namespace: Namespace): TranslationTree | null {
            const catalog = loadedCatalogs[locale];
            if (!catalog) {
                if (import.meta.env.DEV) {
                    // eslint-disable-next-line no-console
                    console.warn(
                        `[i18n] Catalog for locale "${locale}" is not loaded yet.`,
                    );
                }
                return null;
            }

            const tree = catalog[namespace];
            if (!tree && import.meta.env.DEV) {
                // eslint-disable-next-line no-console
                console.warn(
                    `[i18n] Missing catalog for locale "${locale}" and namespace "${namespace}".`,
                );
            }

            return tree ?? null;
        },
    };
}

export const catalogProvider: PreloadableCatalogProvider = Object.assign(
    createCatalogProvider(),
    { preloadLocale },
);

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
        catalogProvider,
    };
}
