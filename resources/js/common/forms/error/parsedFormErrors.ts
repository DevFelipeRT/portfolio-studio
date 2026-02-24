import { normalizeFormError } from '@/common/forms/error/normalizer';
import type { FormErrors } from '@/common/forms/types';

type ErrorEntry = {
  key: string;
  message: string;
};

type ParsedFormErrors<FieldName extends string = string> = {
  entries: readonly ErrorEntry[];
  rootFields: readonly FieldName[];
};

function buildErrorEntry(
  value: unknown,
  keyPrefix: string,
): ErrorEntry | null {
  if (!keyPrefix) {
    return null;
  }

  const message = normalizeFormError(value);
  if (!message) {
    return null;
  }

  return { key: keyPrefix, message };
}

function collectNestedEntries(
  value: Record<string, unknown>,
  keyPrefix: string,
): ErrorEntry[] {
  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const nestedKey = keyPrefix ? `${keyPrefix}.${key}` : key;
    return collectErrorEntries(nestedValue, nestedKey);
  });
}

function collectErrorEntries(value: unknown, keyPrefix = ''): ErrorEntry[] {
  if (typeof value === 'string' || Array.isArray(value)) {
    const entry = buildErrorEntry(value, keyPrefix);
    return entry ? [entry] : [];
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  const nestedEntries = collectNestedEntries(
    value as Record<string, unknown>,
    keyPrefix,
  );
  if (nestedEntries.length > 0) {
    return nestedEntries;
  }

  const fallbackEntry = buildErrorEntry(value, keyPrefix);
  return fallbackEntry ? [fallbackEntry] : [];
}

function collectRootFields<FieldName extends string>(
  entries: readonly ErrorEntry[],
): FieldName[] {
  return Array.from(
    new Set(
      entries
        .map((entry) => entry.key.split(/[.[\]]/)[0])
        .filter((field) => field.length > 0),
    ),
  ) as FieldName[];
}

/**
 * Collects parsed entries and root fields from the current errors map.
 */
export function collectParsedFormErrors<FieldName extends string>(
  errors: FormErrors<FieldName>,
): ParsedFormErrors<FieldName> {
  const entries = collectErrorEntries(errors);
  const rootFields = collectRootFields<FieldName>(entries);
  return { entries, rootFields };
}
