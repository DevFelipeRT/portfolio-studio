import { I18N_NAMESPACES, useTranslation } from '@/common/i18n';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { TableSortHeaderProps, TableSortState } from '../types';

export function TableSortHeader({
  column,
  label,
  sort,
  onToggleSort,
  srLabel,
  className,
  type = 'button',
  disabled = false,
  ...props
}: TableSortHeaderProps) {
  const { translate: tTable } = useTranslation(I18N_NAMESPACES.table);
  const activeDirection = disabled ? null : getActiveSortDirection(sort, column);
  const nextDirection = activeDirection === 'asc' ? 'desc' : 'asc';
  const accessibleColumnLabel =
    srLabel ?? (typeof label === 'string' ? label : column);
  const statusText = disabled
    ? tTable('sortingUnavailable', 'Sorting is not available for this column')
    : activeDirection === 'asc'
      ? tTable('sortedAscending', 'Sorted ascending')
      : activeDirection === 'desc'
        ? tTable('sortedDescending', 'Sorted descending')
        : tTable('notSorted', 'Not currently sorted');
  const actionText = disabled
    ? ''
    : nextDirection === 'desc'
      ? tTable('activateToSortDescending', 'Activate to sort descending')
      : tTable('activateToSortAscending', 'Activate to sort ascending');

  if (disabled) {
    return (
      <span
        className={cn(
          '-ml-1 -my-1 inline-flex max-w-full items-center gap-1 rounded-sm px-1 py-1 text-left text-muted-foreground',
          className,
        )}
      >
        <span className="truncate">{label}</span>
        <span className="sr-only">
          {accessibleColumnLabel}. {statusText}.
        </span>
      </span>
    );
  }

  return (
    <button
      type={type}
      className={cn(
        '-ml-1 -my-1 inline-flex max-w-full items-center gap-1 rounded-sm px-1 py-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        activeDirection
          ? 'text-primary'
          : 'text-muted-foreground hover:text-accent-foreground',
        className,
      )}
      onClick={() => onToggleSort?.(column)}
      {...props}
    >
      <span className="truncate">{label}</span>
      <span aria-hidden="true" className="shrink-0">
        {disabled ? (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-25" />
        ) : activeDirection === 'asc' ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : activeDirection === 'desc' ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
        )}
      </span>
      <span className="sr-only">
        {accessibleColumnLabel}. {statusText}
        {actionText ? ` ${actionText}.` : ''}
      </span>
    </button>
  );
}

function getActiveSortDirection(
  sort: TableSortState,
  column: string,
): TableSortState['direction'] {
  if (sort.column !== column) {
    return null;
  }

  return sort.direction;
}
