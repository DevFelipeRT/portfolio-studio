import type {
    Catalog,
    Locale,
    Namespace,
    TranslationTree,
} from '../types';

/**
 * CatalogSource maps locale identifiers to their catalog of translation trees.
 */
export type CatalogSource = Record<Locale, Catalog>;

/**
 * CatalogProviderOptions defines callbacks for missing catalog data.
 */
export interface CatalogProviderOptions {
    onMissingCatalog?(locale: Locale): void;
    onMissingTranslationTree?(locale: Locale, namespace: Namespace): void;
}

/**
 * CatalogProvider provides access to locale catalogs and their translation trees.
 */
export interface CatalogProvider {
    /**
     * Returns the list of locales available in the underlying source.
     */
    getSupportedLocales(): readonly Locale[];

    /**
     * Returns the namespaces available for a given locale.
     */
    getNamespaces(locale: Locale): readonly Namespace[];

    /**
     * Returns the catalog for a given locale.
     */
    getCatalog(locale: Locale): Catalog | null;

    /**
     * Returns the translation tree for a given locale and namespace.
     */
    getTranslationTree(locale: Locale, namespace: Namespace): TranslationTree | null;
}
