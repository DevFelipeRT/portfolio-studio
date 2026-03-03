'use client';

import { useFormsTranslation } from '@/common/forms/hooks/useFormsTranslation';
import { I18N_NAMESPACES } from '@/common/i18n';
import { FieldLabel as ShadcnFieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface FormLabelProps {
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Renders a label and appends a required marker when the field is required.
 */
export function FieldLabel({
  htmlFor,
  required = false,
  children,
  className,
}: FormLabelProps) {
  const { translate } = useFormsTranslation(I18N_NAMESPACES.labels);
  const requiredLabel = translate('required', 'Required');

  return (
    <ShadcnFieldLabel
      htmlFor={htmlFor}
      className={cn(className)}
    >
      {children}
      {required && (
        <>
          <span className="text-destructive ml-1" aria-hidden="true">
            *
          </span>
          <span className="sr-only"> ({requiredLabel})</span>
        </>
      )}
    </ShadcnFieldLabel>
  );
}
