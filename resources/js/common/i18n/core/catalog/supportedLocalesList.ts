import type { Locale } from '../types';
import type { CatalogSource } from './types';

/**
 * Returns the list of locale identifiers present in the CatalogSource.
 */
export function listSupportedLocales(source: CatalogSource): readonly Locale[] {
  return Object.freeze(Object.keys(source)) as readonly Locale[];
}
