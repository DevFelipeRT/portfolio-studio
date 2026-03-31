import { forwardRef } from 'react';

import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

import type { TableSurfaceRowProps } from '../types';

export const TableSurfaceRow = forwardRef<HTMLTableRowElement, TableSurfaceRowProps>(
  function TableSurfaceRow(
    { active = false, className, variant = 'default', ...props },
    ref,
  ) {
    return (
      <TableRow
        ref={ref}
        className={cn(surfaceVariantClassName(variant, active), className)}
        {...props}
      />
    );
  },
);

TableSurfaceRow.displayName = 'TableSurfaceRow';

export function surfaceVariantClassName(
  variant: TableSurfaceRowProps['variant'],
  active: boolean,
): string {
  switch (variant) {
    case 'muted':
      return cn(
        'group [&>td:first-child]:border-l bg-muted/40 hover:bg-muted/60 dark:bg-muted/40 dark:hover:bg-muted/70',
        active
          ? '[&>td:first-child]:border-l-primary/70'
          : '[&>td:first-child]:border-l-transparent',
      );
    case 'emphasized':
      return cn(
        'group [&>td:first-child]:border-l bg-background hover:bg-muted/60 dark:bg-background dark:hover:bg-muted/40',
        active
          ? '[&>td:first-child]:border-l-4 [&>td:first-child]:border-l-primary/70'
          : '[&>td:first-child]:border-l-transparent',
      );
    case 'default':
    default:
      return cn(
        'group [&>td:first-child]:border-l bg-background hover:bg-muted/60 dark:bg-background dark:hover:bg-muted/40',
        active
          ? '[&>td:first-child]:border-l-primary/70'
          : '[&>td:first-child]:border-l-transparent',
      );
  }
}
