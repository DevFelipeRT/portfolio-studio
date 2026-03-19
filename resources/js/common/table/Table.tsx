import { forwardRef } from 'react';

import { Table } from '@/components/ui/table';
import { cn } from '@/lib/utils';

import type { SystemTableProps } from './types';

export const SystemTable = forwardRef<HTMLTableElement, SystemTableProps>(
  function SystemTable(
    { className, layout = 'auto', density = 'default', ...props },
    ref,
  ) {
    return (
      <Table
        ref={ref}
        className={cn(
          'min-w-0',
          layout === 'fixed' ? 'table-fixed' : 'table-auto',
          density === 'compact'
            ? '[&_td]:px-3 [&_td]:py-2 [&_th]:px-3 [&_th]:py-2'
            : '[&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3',
          className,
        )}
        {...props}
      />
    );
  },
);

SystemTable.displayName = 'SystemTable';
