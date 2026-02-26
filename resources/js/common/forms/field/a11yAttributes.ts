import type { FieldA11yAttributes } from '@/common/forms/types';

/**
 * Returns accessibility attributes for a field when an error message is present.
 */
export function getFieldA11yAttributes(
  error: string | null,
  errorId: string,
  required = false,
): FieldA11yAttributes {
  const attributes: FieldA11yAttributes = {};

  if (required) {
    attributes['aria-required'] = true;
  }

  if (!error) {
    return attributes;
  }

  return {
    ...attributes,
    'aria-invalid': true,
    'aria-describedby': errorId,
    'aria-errormessage': errorId,
  };
}
