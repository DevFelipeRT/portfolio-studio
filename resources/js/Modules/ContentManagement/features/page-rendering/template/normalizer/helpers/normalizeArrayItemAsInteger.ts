import { parseIntegerFromString } from '@/Modules/ContentManagement/utils/numbers';

/**
 * Normalizes one array item to an integer.
 *
 * - Accepts finite numbers.
 * - Accepts strings parseable as base-10 integer.
 * - Returns `undefined` for unsupported or invalid values.
 */
export function normalizeArrayItemAsInteger(item: unknown): number | undefined {
  if (typeof item === 'number') {
    return Number.isFinite(item) ? item : undefined;
  }

  if (typeof item === 'string') {
    return parseIntegerFromString(item);
  }

  return undefined;
}
