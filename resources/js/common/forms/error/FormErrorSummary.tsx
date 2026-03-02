'use client';

import { useFormsTranslation } from '@/common/forms/hooks/useFormsTranslation';
import { I18N_NAMESPACES } from '@/common/i18n';
import type { ErrorSummary } from '@/common/forms/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface FormErrorSummaryProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  fields: ErrorSummary;
  title?: ReactNode;
}

/**
 * Renders a summary block listing fields with validation errors.
 */
export function FormErrorSummary({
  fields,
  title,
  className,
  ...props
}: FormErrorSummaryProps) {
  const { translate } = useFormsTranslation(I18N_NAMESPACES.form);

  if (fields.length === 0) {
    return null;
  }

  const resolvedTitle =
    title ??
    translate(
      'errorSummary.title',
      'Please fix the highlighted fields and try again.',
    );

  return (
    <Alert
      variant="destructive"
      className={cn(className)}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      <AlertTitle>{resolvedTitle}</AlertTitle>
      <AlertDescription>
        {fields.map((field) => field.label).join(', ')}.
      </AlertDescription>
    </Alert>
  );
}
