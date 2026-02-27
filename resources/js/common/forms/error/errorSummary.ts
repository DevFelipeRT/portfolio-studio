import { collectParsedFormErrors } from '@/common/forms/error/parsedFormErrors';
import type { ErrorSummary, FormErrors, SummaryErrorField } from '@/common/forms/types';

function buildSummaryFieldLabel(fieldName: string): string {
  const label = fieldName.replace(/_/g, ' ').trim();
  if (!label) {
    return label;
  }

  return `${label.charAt(0).toUpperCase()}${label.slice(1)}`;
}

function buildSummaryField<FieldName extends string>(
  fieldName: FieldName,
): SummaryErrorField<FieldName> {
  return {
    name: fieldName,
    label: buildSummaryFieldLabel(fieldName),
  };
}

/**
 * Collects global summary fields from root form error entries.
 */
export function collectFormErrorSummary<FieldName extends string>(
  errors: FormErrors<FieldName>,
): ErrorSummary<FieldName> {
  const { rootFields } = collectParsedFormErrors(errors);

  return rootFields.map((field) => buildSummaryField(field));
}
