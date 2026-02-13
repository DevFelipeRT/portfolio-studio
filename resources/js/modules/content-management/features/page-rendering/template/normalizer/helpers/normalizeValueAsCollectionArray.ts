import type { SectionDataValue } from '@/modules/content-management/types';

/**
 * Normalizes a field value as collection array.
 *
 * - Returns the original value when it is an array.
 * - Returns `undefined` for non-array values.
 */
export function normalizeValueAsCollectionArray(
  value: SectionDataValue,
): SectionDataValue | undefined {
  return Array.isArray(value) ? value : undefined;
}
