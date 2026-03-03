import type { Catalog, Locale, Namespace, TranslationTree } from '../../types';

type LoaderEntry = {
    namespace: Namespace;
    loader: () => Promise<{ default: TranslationTree }>;
};

/**
 * Creates a locale catalog preloader with in-memory caching and in-flight deduplication.
 */
export function createLocaleCatalogPreloader(
    loadersByLocale: Map<Locale, LoaderEntry[]>,
): {
    loadedCatalogs: Partial<Record<Locale, Catalog>>;
    preloadLocale(locale: Locale): Promise<void>;
} {
    const loadedCatalogs: Partial<Record<Locale, Catalog>> = {};
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
                const catalog: Catalog = {} as Catalog;
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

    return {
        loadedCatalogs,
        preloadLocale,
    };
}
