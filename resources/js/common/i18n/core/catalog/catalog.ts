import type { Catalog, Locale } from '../types';
import type { CatalogProviderOptions, CatalogSource } from './types';

/**
 * Returns the catalog associated with the given locale.
 */
export function selectCatalog(
  source: CatalogSource,
  locale: Locale,
  options?: CatalogProviderOptions,
): Catalog | null {
  const catalog = source[locale] ?? null;
  if (!catalog) {
    options?.onMissingCatalog?.(locale);
  }
  return catalog;
}
