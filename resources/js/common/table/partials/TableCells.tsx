import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { tablePresets } from '../presets';
import type {
  TableDateTextProps,
  TableMetaCellProps,
  TableStatusStackProps,
  TableTitleCellProps,
} from '../types';

export function TableTitleCell({
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
  children,
  className,
  ...props
}: TableTitleCellProps) {
  return (
    <TableCell
      className={cn(tablePresets.summaryCell, 'content-center pr-2', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-0.5">
        <p
          className={cn(
            'line-clamp-1 min-w-0 truncate font-medium text-pretty hyphens-auto',
            titleClassName,
          )}
        >
          {title}
        </p>

        {subtitle ? (
          <p
            className={cn(
              'text-muted-foreground line-clamp-1 min-w-0 truncate text-xs text-pretty hyphens-auto',
              subtitleClassName,
            )}
          >
            {subtitle}
          </p>
        ) : null}

        {children}
      </div>
    </TableCell>
  );
}

export function TableMetaCell({
  className,
  children,
  ...props
}: TableMetaCellProps) {
  return (
    <TableCell
      className={cn(tablePresets.metaCell, 'content-center pr-2', className)}
      {...props}
    >
      {children}
    </TableCell>
  );
}

export function TableStatusStack({
  className,
  children,
  ...props
}: TableStatusStackProps) {
  return (
    <div
      className={cn(
        'xs:flex-row flex w-full flex-col items-center gap-2 sm:flex-nowrap',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TableDateText({
  className,
  children,
  ...props
}: TableDateTextProps) {
  return (
    <span className={cn('block whitespace-nowrap', className)} {...props}>
      {children}
    </span>
  );
}
