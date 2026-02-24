import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { ErrorSummary } from '@/common/forms/types';
import type { HTMLAttributes, ReactNode } from 'react';

interface FormErrorSummaryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  fields: ErrorSummary;
  title?: ReactNode;
}

/**
 * Renders a summary block listing fields with validation errors.
 */
export function FormErrorSummary({
  fields,
  title = 'Please fix the highlighted fields and try again.',
  className,
  ...props
}: FormErrorSummaryProps) {
  if (fields.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className={cn(className)} {...props}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {fields.map((field) => field.label).join(', ')}.
      </AlertDescription>
    </Alert>
  );
}
