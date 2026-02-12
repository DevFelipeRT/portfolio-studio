import type { SectionDataValue } from '@/Modules/ContentManagement/types';
import { parseIntegerFromString } from '@/Modules/ContentManagement/utils/numbers';

/**
 * Normalizes a field value as integer.
 *
 * - Accepts finite numbers directly.
 * - Accepts strings parseable as base-10 integer.
 * - Returns `undefined` for unsupported or invalid values.
 */
export function normalizeValueAsInteger(
  value: SectionDataValue,
): number | undefined {
  if (value == null) {
    return undefined;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === 'string') {
    return parseIntegerFromString(value);
  }

  return undefined;
}
