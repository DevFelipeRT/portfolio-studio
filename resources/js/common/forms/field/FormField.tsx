import { getFieldA11yAttributes } from '@/common/forms/field/a11yAttributes';
import { FieldError } from '@/common/forms/field/error/FieldError';
import { resolveFieldErrorMessage } from '@/common/forms/field/error/fieldErrorMessage';
import { FieldLabel } from '@/common/forms/field/FieldLabel';
import {
  getInputErrorClassName,
  getSelectErrorClassName,
} from '@/common/forms/field/styles';
import type { FieldA11yAttributes, FormErrors } from '@/common/forms/types';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type FormFieldRenderContext = {
  error: string | null;
  hasError: boolean;
  hasErrors: boolean;
  errorId: string;
  a11yAttributes: FieldA11yAttributes;
  getInputClassName(): string;
  getSelectClassName(): string;
};

type FormFieldVariant = 'default' | 'inline';

interface FormFieldProps<FieldName extends string> {
  name: FieldName;
  errors: FormErrors<FieldName>;
  htmlFor: string;
  label: ReactNode;
  required?: boolean;
  errorId?: string;
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
  required = false,
  errorId = `${htmlFor}-error`,
  className,
  variant = 'default',
  children,
}: FormFieldProps<FieldName>) {
  const error = resolveFieldErrorMessage(errors, name);
  const hasError = Boolean(error);
  const a11yAttributes = getFieldA11yAttributes(error, errorId);

  const content =
    typeof children === 'function'
      ? children({
          error,
          hasError,
          hasErrors: hasError,
          errorId,
          a11yAttributes,
          getInputClassName: () => getInputErrorClassName(hasError),
          getSelectClassName: () => getSelectErrorClassName(hasError),
        })
      : children;

  if (variant === 'inline') {
    return (
      <div className={cn('space-y-1.5', className)}>
        <div className="flex items-center gap-2">
          {content}
          <FieldLabel
            htmlFor={htmlFor}
            required={required}
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </FieldLabel>
        </div>
        <FieldError id={errorId} message={error} />
      </div>
    );
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      <FieldLabel htmlFor={htmlFor} required={required}>
        {label}
      </FieldLabel>
      {content}
      <FieldError id={errorId} message={error} />
    </div>
  );
}
