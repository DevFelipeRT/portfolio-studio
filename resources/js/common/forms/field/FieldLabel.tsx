import { Label } from '@/components/ui/label';
import type { ReactNode } from 'react';

interface FormLabelProps {
  htmlFor: string;
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
  return (
    <Label htmlFor={htmlFor} className={className}>
      {children}
      {required && (
        <span className="text-destructive ml-1" aria-hidden="true">
          *
        </span>
      )}
    </Label>
  );
}
