import { Label } from '@/Components/Ui/label';
import type { ReactNode } from 'react';

interface FieldFrameProps {
  id: string;
  label: string;
  required?: boolean;
  helperText?: string;
  children: ReactNode;
}

export function FieldFrame({
  id,
  label,
  required,
  helperText,
  children,
}: FieldFrameProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {helperText && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}
    </div>
  );
}
