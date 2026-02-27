import type { FieldA11yAttributes } from '@/common/forms/types';

/**
 * Returns accessibility attributes for a field when an error message is present.
 */
export function getFieldA11yAttributes(
  error: string | null,
  errorId: string,
  required = false,
  hintId?: string,
): FieldA11yAttributes {
  const attributes: FieldA11yAttributes = {};

  if (required) {
    attributes['aria-required'] = true;
  }

  const describedBy = [hintId, error ? errorId : null]
    .filter(Boolean)
    .join(' ');

  if (describedBy) {
    attributes['aria-describedby'] = describedBy;
  }

  if (!error) {
    return attributes;
  }

  return {
    ...attributes,
    'aria-invalid': true,
    'aria-errormessage': errorId,
  };
}
