import type { SectionDataValue } from '@/modules/content-management/types';
import { normalizeArrayItemAsInteger } from './normalizeArrayItemAsInteger';

/**
 * Normalizes a field value as integer array.
 *
 * - Requires the input value to be an array.
 * - Requires each array item to be non-null and normalizable as integer.
 * - Returns `undefined` when any validation step fails.
 */
export function normalizeValueAsIntegerArray(
  value: SectionDataValue,
): number[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const result: number[] = [];

  for (const item of value) {
    if (item == null) {
      return undefined;
    }

    const normalized = normalizeArrayItemAsInteger(item);

    if (normalized === undefined) {
      return undefined;
    }

    result.push(normalized);
  }

  return result;
}
