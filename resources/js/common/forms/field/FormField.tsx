import { getFieldA11yAttributes } from '@/common/forms/field/a11yAttributes';
import { FieldError } from '@/common/forms/field/error/FieldError';
import { resolveFieldErrorMessage } from '@/common/forms/field/error/fieldErrorMessage';
import { FieldHintText } from '@/common/forms/field/partials/FieldHintText';
import { FieldLabel } from '@/common/forms/field/partials/FieldLabel';
import {
  getInputErrorClassName,
  getSelectErrorClassName,
} from '@/common/forms/field/styles';
import type { FieldA11yAttributes, FormErrors } from '@/common/forms/types';
import { Field, FieldContent } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type FormFieldRenderContext = {
  error: string | null;
  hasError: boolean;
  hasErrors: boolean;
  errorId: string;
  hintId: string;
  a11yAttributes: FieldA11yAttributes;
  getInputClassName(): string;
  getSelectClassName(): string;
};

type FormFieldVariant = 'default' | 'inline' | 'group';

interface FormFieldProps<FieldName extends string> {
  name: FieldName;
  errors: FormErrors<FieldName>;
  htmlFor: string;
  label: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  errorId?: string;
  hintId?: string;
  className?: string;
  variant?: FormFieldVariant;
  children: ReactNode | ((context: FormFieldRenderContext) => ReactNode);
}

/**
 * Renders label, field content, and field-level error using a shared error source.
 */
export function FormField<FieldName extends string>({
  name,
  errors,
  htmlFor,
  label,
  hint,
  required = false,
  disabled = false,
  errorId = `${htmlFor}-error`,
  hintId = `${htmlFor}-hint`,
  className,
  variant = 'default',
  children,
}: FormFieldProps<FieldName>) {
  const error = resolveFieldErrorMessage(errors, name);
  const hasError = Boolean(error);
  const a11yAttributes = getFieldA11yAttributes(
    error,
    errorId,
    required,
    hint ? hintId : undefined,
  );

  const content =
    typeof children === 'function'
      ? children({
          error,
          hasError,
          hasErrors: hasError,
          errorId,
          hintId,
          a11yAttributes,
          getInputClassName: () => getInputErrorClassName(hasError),
          getSelectClassName: () => getSelectErrorClassName(hasError),
        })
      : children;

  if (variant === 'inline') {
    return (
      <div className={cn('space-y-1.5', className)}>
        <Field
          orientation="horizontal"
          data-invalid={hasError}
          data-disabled={disabled}
          className="gap-2"
        >
          {content}
          <FieldLabel htmlFor={htmlFor} required={required}>
            {label}
          </FieldLabel>
        </Field>
        {hint && <FieldHintText id={hintId}>{hint}</FieldHintText>}
        <FieldError id={errorId} message={error} />
      </div>
    );
  }

  if (variant === 'group') {
    return (
      <Field
        orientation="vertical"
        data-invalid={hasError}
        data-disabled={disabled}
        className={cn('gap-1.5', className)}
      >
        <FieldLabel required={required}>
          {label}
        </FieldLabel>
        <FieldContent className="gap-1.5">
          {hint && <FieldHintText id={hintId}>{hint}</FieldHintText>}
          {content}
          <FieldError id={errorId} message={error} />
        </FieldContent>
      </Field>
    );
  }

  return (
    <Field
      orientation="vertical"
      data-invalid={hasError}
      data-disabled={disabled}
      className={cn('gap-1.5', className)}
    >
      <FieldLabel htmlFor={htmlFor} required={required}>
        {label}
      </FieldLabel>
      <FieldContent className="gap-1.5">
        {hint && <FieldHintText id={hintId}>{hint}</FieldHintText>}
        {content}
        <FieldError id={errorId} message={error} />
      </FieldContent>
    </Field>
  );
}
