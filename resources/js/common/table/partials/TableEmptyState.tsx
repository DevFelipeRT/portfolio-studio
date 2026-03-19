import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

import type { TableEmptyStateProps } from '../types';

export function TableEmptyState({
  colSpan,
  message,
  density = 'default',
  className,
}: TableEmptyStateProps) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className={cn(
          'text-muted-foreground text-center text-sm',
          density === 'compact' ? 'py-8' : 'py-10',
          className,
        )}
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
