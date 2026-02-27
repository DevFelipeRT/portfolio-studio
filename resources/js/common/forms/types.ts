/**
 * Represents a form error value that can be a single message or multiple messages.
 */
export type FormErrorMessage = string | string[];

/**
 * Represents an optional form error value.
 */
export type FormErrorValue = FormErrorMessage | undefined;

/**
 * Represents a map of form errors keyed by field name.
 */
export type FormErrors<FieldName extends string = string> =
  Partial<Record<FieldName, FormErrorValue>> &
    Record<string, FormErrorValue>;

/**
 * Represents a field listed in the global form error summary.
 */
export type SummaryErrorField<FieldName extends string = string> = {
  name: FieldName;
  label: string;
};

/**
 * Represents the fields displayed in the global form error summary.
 */
export type ErrorSummary<FieldName extends string = string> =
  readonly SummaryErrorField<FieldName>[];

/**
 * Represents accessibility attributes applied to fields with validation errors.
 */
export type FieldA11yAttributes = {
  'aria-invalid'?: true;
  'aria-describedby'?: string;
  'aria-errormessage'?: string;
  'aria-required'?: true;
};
