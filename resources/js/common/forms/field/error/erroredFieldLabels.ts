import { resolveFieldErrorMessage } from '@/common/forms/field/error/fieldErrorMessage';
import type { ErrorSummary, FormErrors } from '@/common/forms/types';

/**
 * Collects summary fields that currently have validation errors.
 */
export function collectErroredFieldLabels<FieldName extends string>(
  errors: FormErrors<FieldName>,
  fields: ErrorSummary<FieldName>,
): ErrorSummary<FieldName> {
  return fields.filter((field) =>
    Boolean(resolveFieldErrorMessage(errors, field.name)),
  );
}
