import type { FieldA11yAttributes } from '@/common/forms/types';

/**
 * Returns accessibility attributes for a field when an error message is present.
 */
export function getFieldA11yAttributes(
  error: string | null,
  errorId: string,
): FieldA11yAttributes {
  if (!error) {
    return {};
  }

  return {
    'aria-invalid': true,
    'aria-describedby': errorId,
  };
}
