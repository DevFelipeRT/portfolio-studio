import type { SectionDataValue } from '@/modules/content-management/types';
import { parseBooleanFromString } from '@/modules/content-management/utils/booleans';

/**
 * Normalizes a field value as boolean.
 *
 * - Accepts boolean values directly.
 * - Accepts string values parseable as boolean.
 * - Returns `undefined` for unsupported or invalid values.
 */
export function normalizeValueAsBoolean(
  value: SectionDataValue,
): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  return parseBooleanFromString(value);
}
