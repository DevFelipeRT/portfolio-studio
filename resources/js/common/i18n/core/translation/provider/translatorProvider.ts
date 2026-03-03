import type { CatalogProvider } from '../../catalog';
import { canonicalizeLocale } from '../../locale';
import type { Catalog, Locale, Namespace, TranslationTree } from '../../types';
import { createTranslator } from '../translator';
import type {
  TranslationModuleLoaders,
  Translator,
  TranslatorFactoryConfig,
  TranslatorProvider,
} from '../types';
import { indexLoadersByLocale } from './indexLoadersByLocale';
import { createLocaleCatalogPreloader } from './localeCatalogPreloader';
import { parseTranslationModulePath } from './parseTranslationModulePath';

/**
 * Creates a TranslatorProvider from Vite glob loaders.
 *
 * The only convention assumed is: `.../<locale>/<namespace>.ts`.
 *
 * This keeps i18n independent from any global namespace registry: domains can
 * choose their own internal namespace organization (e.g. `forms`, `table`).
 */
export function createTranslatorProviderFromLoaders(
  loaders: TranslationModuleLoaders,
): TranslatorProvider {
  const { loadersByLocale, namespacesByLocale, supportedLocales } =
    indexLoadersByLocale(loaders, (modulePath) =>
      parseTranslationModulePath(modulePath, canonicalizeLocale),
    );

  const { loadedCatalogs, preloadLocale } =
    createLocaleCatalogPreloader(loadersByLocale);

  const catalogProvider: CatalogProvider = {
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
    getCatalog(locale: Locale): Catalog | null {
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

      return catalog;
    },
    getTranslationTree(
      locale: Locale,
      namespace: Namespace,
    ): TranslationTree | null {
      const catalog = this.getCatalog(locale);
      if (!catalog) {
        return null;
      }

      const tree = catalog[namespace];
      if (!tree && import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn(
          `[i18n] Missing translation tree for locale "${locale}" and namespace "${namespace}".`,
        );
      }

      return tree ?? null;
    },
  };

  function createTranslatorInstance(
    config: TranslatorFactoryConfig,
  ): Translator {
    return createTranslator(catalogProvider, config);
  }

  return {
    ...catalogProvider,
    preloadLocale,
    createTranslator: createTranslatorInstance,
  };
}
