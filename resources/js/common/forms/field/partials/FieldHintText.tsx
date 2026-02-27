import type { ReactNode } from 'react';
import { FieldDescription } from '@/components/ui/field';

interface FieldHintTextProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export function FieldHintText({ id, className, children }: FieldHintTextProps) {
  return (
    <FieldDescription id={id} className={className}>
      {children}
    </FieldDescription>
  );
}
