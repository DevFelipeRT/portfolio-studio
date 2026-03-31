import { ChevronRight } from 'lucide-react';

import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

import type { TableActionCellProps } from '../types';

export function TableActionCell({
  className,
  children,
  showChevron = false,
  chevronClassName,
  ...props
}: TableActionCellProps) {
  return (
    <TableCell className={cn('w-0 whitespace-nowrap align-top', className)} {...props}>
      <div className="flex items-center justify-end gap-1">
        {children}

        {showChevron ? (
          <div className="flex h-8 w-8 items-center justify-center">
            <ChevronRight
              className={cn(
                'text-muted-foreground h-4 w-4 shrink-0 opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100',
                'group-hover:text-primary',
                chevronClassName,
              )}
            />
          </div>
        ) : null}
      </div>
    </TableCell>
  );
}
