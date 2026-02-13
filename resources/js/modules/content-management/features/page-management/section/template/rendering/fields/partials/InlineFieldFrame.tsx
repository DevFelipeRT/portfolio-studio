import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface InlineFieldFrameProps {
  id: string;
  label: string;
  required?: boolean;
  helperText?: string;
  containerClassName?: string;
  rowClassName?: string;
  children: ReactNode;
}

export function InlineFieldFrame({
  id,
  label,
  required,
  helperText,
  containerClassName,
  rowClassName,
  children,
}: InlineFieldFrameProps) {
  return (
    <div className={cn('space-y-1', containerClassName)}>
      <div className={cn('flex items-start gap-2', rowClassName)}>
        {children}
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
      {helperText && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}
    </div>
  );
}
