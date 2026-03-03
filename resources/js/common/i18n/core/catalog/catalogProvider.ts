import type { Catalog, Locale, Namespace, TranslationTree } from '../types';
import { selectCatalog } from './catalog';
import { listNamespaces } from './namespaceList';
import { listSupportedLocales } from './supportedLocalesList';
import { selectTranslationTree } from './translationTree';
import type {
  CatalogProvider,
  CatalogProviderOptions,
  CatalogSource,
} from './types';

/**
 * Creates a CatalogProvider backed by the provided CatalogSource.
 */
export function createCatalogProvider(
  source: CatalogSource,
  options?: CatalogProviderOptions,
): CatalogProvider {
  const supportedLocales = listSupportedLocales(source);

  function getSupportedLocales(): readonly Locale[] {
    return supportedLocales;
  }

  function getNamespaces(locale: Locale): readonly Namespace[] {
    return listNamespaces(source, locale);
  }

  function getCatalog(locale: Locale): Catalog | null {
    return selectCatalog(source, locale, options);
  }

  function getTranslationTree(
    locale: Locale,
    namespace: Namespace,
  ): TranslationTree | null {
    return selectTranslationTree(source, locale, namespace, options);
  }

  return {
    getSupportedLocales,
    getNamespaces,
    getCatalog,
    getTranslationTree,
  };
}
