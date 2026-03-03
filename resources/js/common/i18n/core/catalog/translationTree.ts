import type { Locale, Namespace, TranslationTree } from '../types';
import { selectCatalog } from './catalog';
import type { CatalogProviderOptions, CatalogSource } from './types';

/**
 * Returns the translation tree associated with the given locale and namespace.
 */
export function selectTranslationTree(
  source: CatalogSource,
  locale: Locale,
  namespace: Namespace,
  options?: CatalogProviderOptions,
): TranslationTree | null {
  const catalog = selectCatalog(source, locale, options);
  if (!catalog) {
    return null;
  }

  const tree = catalog[namespace] ?? null;
  if (!tree) {
    options?.onMissingTranslationTree?.(locale, namespace);
  }

  return tree;
}
