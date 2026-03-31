import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

import type { TableActionCellProps } from '../types';

export function TableActionCell({
  className,
  children,
  ...props
}: TableActionCellProps) {
  return (
    <TableCell
      className={cn('w-0 whitespace-nowrap align-top !pl-0', className)}
      {...props}
    >
      <div className="flex items-center justify-end">
        {children}
      </div>
    </TableCell>
  );
}
