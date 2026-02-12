import type { SectionDataValue } from '@/Modules/ContentManagement/types';

/**
 * Normalizes a field value as trimmed string.
 *
 * - Returns `undefined` for `null` and `undefined`.
 * - Converts arrays with comma join.
 * - Converts objects with `JSON.stringify`.
 * - Converts primitives with `String(...)`.
 * - Returns `undefined` when the trimmed string is empty.
 */
export function normalizeValueAsTrimmedString(
  value: SectionDataValue,
): string | undefined {
  if (value == null) {
    return undefined;
  }

  let asString: string;

  if (Array.isArray(value)) {
    asString = String(value.join(','));
  } else if (typeof value === 'object') {
    asString = JSON.stringify(value);
  } else {
    asString = String(value);
  }

  const trimmed = asString.trim();

  if (trimmed === '') {
    return undefined;
  }

  return trimmed;
}
