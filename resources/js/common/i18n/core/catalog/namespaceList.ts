import type { Locale, Namespace } from '../types';
import type { CatalogSource } from './types';

/**
 * Returns the namespaces available for the given locale.
 */
export function listNamespaces(
  source: CatalogSource,
  locale: Locale,
): readonly Namespace[] {
  const catalog = source[locale];
  if (!catalog) {
    return [];
  }

  return Object.keys(catalog) as readonly Namespace[];
}
