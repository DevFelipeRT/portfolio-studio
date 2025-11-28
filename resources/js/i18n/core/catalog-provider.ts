import { Locale, Namespace, NamespacedCatalog, TranslationTree } from './types';

/**
 * CatalogSource represents an in-memory map of locales to namespaced catalogs.
 */
export type CatalogSource = Record<Locale, NamespacedCatalog>;

export interface CatalogProviderOptions {
    onMissingCatalog?(locale: Locale, namespace: Namespace): void;
}

/**
 * CatalogProvider exposes translation trees for a given locale and namespace.
 */
export interface CatalogProvider {
    getSupportedLocales(): readonly Locale[];
    getNamespaces(locale: Locale): readonly Namespace[];
    getCatalog(locale: Locale, namespace: Namespace): TranslationTree | null;
}

/**
 * Creates a CatalogProvider backed by a static in-memory CatalogSource.
 */
export function createStaticCatalogProvider(
    source: CatalogSource,
    options?: CatalogProviderOptions,
): CatalogProvider {
    const supportedLocales = Object.freeze(Object.keys(source));

    function getSupportedLocales(): readonly Locale[] {
        return supportedLocales;
    }

    function getNamespaces(locale: Locale): readonly Namespace[] {
        const catalog = source[locale];
        if (!catalog) {
            return [];
        }

        return Object.keys(catalog);
    }

    function getCatalog(
        locale: Locale,
        namespace: Namespace,
    ): TranslationTree | null {
        const catalog = source[locale];
        if (!catalog) {
            if (options?.onMissingCatalog) {
                options.onMissingCatalog(locale, namespace);
            }
            return null;
        }

        const tree = catalog[namespace];
        if (!tree && options?.onMissingCatalog) {
            options.onMissingCatalog(locale, namespace);
        }

        return tree ?? null;
    }

    return {
        getSupportedLocales,
        getNamespaces,
        getCatalog,
    };
}
