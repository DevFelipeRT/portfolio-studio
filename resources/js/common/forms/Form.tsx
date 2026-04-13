'use client';

import { collectFormErrorSummary, FormErrorSummary } from '@/common/forms/error';
import type { ErrorSummary, FormErrors } from '@/common/forms/types';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export type FormVariant = 'default' | 'spacious';

export type FormProps<FieldName extends string = string> = {
  id?: string;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  errors: FormErrors<FieldName>;
  errorSummaryFields?: ErrorSummary<FieldName>;
  errorSummaryTitle?: ReactNode;
  showErrorSummary?: boolean;
  variant?: FormVariant;
  className?: string;
  children: ReactNode;
};

export function Form<FieldName extends string = string>({
  id,
  onSubmit,
  errors,
  errorSummaryFields,
  errorSummaryTitle,
  showErrorSummary = true,
  variant = 'default',
  className,
  children,
}: FormProps<FieldName>) {
  const summaryFields = errorSummaryFields ?? collectFormErrorSummary(errors);

  const baseClassName = cn(
    'bg-card rounded-lg border p-6 shadow-sm',
    variant === 'spacious' ? 'space-y-8' : 'space-y-6',
    className,
  );

  return (
    <form id={id} onSubmit={onSubmit} className={baseClassName}>
      {showErrorSummary ? (
        <FormErrorSummary fields={summaryFields} title={errorSummaryTitle} />
      ) : null}
      {children}
    </form>
  );
}
