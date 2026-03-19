import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

import type { TableHeaderRowProps } from '../types';

export function TableHeaderRow({
  className,
  children,
  ...props
}: TableHeaderRowProps) {
  return (
    <TableRow className={cn('bg-muted/60 hover:bg-muted/60', className)} {...props}>
      {children}
    </TableRow>
  );
}
