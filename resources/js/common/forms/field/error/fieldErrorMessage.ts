import { collectParsedFormErrors } from '@/common/forms/error/parsedFormErrors';
import type { FormErrors } from '@/common/forms/types';

function buildFieldKeyCandidates(field: string): string[] {
  const dotField = field.replace(/\[(\d+)\]/g, '.$1');
  const bracketField = field.replace(/\.(\d+)/g, '[$1]');
  return Array.from(new Set([field, dotField, bracketField]));
}

function matchErrorForField(
  entries: ReadonlyArray<{ key: string; message: string }>,
  fieldCandidates: string[],
): string | null {
  for (const candidate of fieldCandidates) {
    const exact = entries.find(
      (entry) =>
        entry.key === candidate ||
        entry.key.endsWith(`.${candidate}`) ||
        entry.key.endsWith(`[${candidate}]`),
    );
    if (exact) {
      return exact.message;
    }

    const prefixed = entries.find(
      (entry) =>
        entry.key.startsWith(`${candidate}.`) ||
        entry.key.startsWith(`${candidate}[`) ||
        entry.key.includes(`.${candidate}.`) ||
        entry.key.includes(`.${candidate}[`),
    );
    if (prefixed) {
      return prefixed.message;
    }
  }

  return null;
}

/**
 * Returns the normalized error for a specific field.
 */
export function resolveFieldErrorMessage<FieldName extends string>(
  errors: FormErrors<FieldName>,
  field: FieldName,
): string | null {
  const { entries } = collectParsedFormErrors(errors);
  const fieldCandidates = buildFieldKeyCandidates(field);
  return matchErrorForField(entries, fieldCandidates);
}
