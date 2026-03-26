// resources/js/Pages/Initiatives/Partials/InitiativesTable.tsx

import type { InitiativeListItem } from '@/modules/initiatives/core/types';
import type { ReactNode } from 'react';
import {
    INITIATIVES_NAMESPACES,
    useInitiativesTranslation,
} from '@/modules/initiatives/i18n';

import {
  SystemTable,
  TableCard,
  TableEmptyState,
  TableHeaderRow,
  TablePagination,
  TableSortHeader,
  type TablePaginated,
  type TableSortState,
  tablePresets,
} from '@/common/table';
import {
  TableBody,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { InitiativesRow } from './InitiativesRow';

type InitiativesSortKey = 'name' | 'start_date' | 'display' | 'image_count';

interface InitiativesTableProps {
  initiatives: TablePaginated<InitiativeListItem>;
  onRowClick(initiative: InitiativeListItem): void;
  onToggleDisplay(initiative: InitiativeListItem, event?: React.MouseEvent): void;
  onDelete(initiative: InitiativeListItem, event?: React.MouseEvent): void;
  header?: ReactNode;
  emptyStateMessage?: ReactNode;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSortChange?: (column: string) => void;
  perPageOptions?: readonly number[];
  sort?: TableSortState;
  sortableColumns?: Partial<Record<InitiativesSortKey, boolean>>;
}

/**
 * InitiativesTable renders the initiatives table with headers and rows.
 */
export function InitiativesTable({
  initiatives,
  onRowClick,
  onToggleDisplay,
  onDelete,
  header,
  emptyStateMessage,
  onPageChange,
  onPerPageChange,
  onSortChange,
  perPageOptions,
  sort = { column: null, direction: null },
  sortableColumns = {},
}: InitiativesTableProps) {
  const { translate: tForm } = useInitiativesTranslation(INITIATIVES_NAMESPACES.form);
  const baseClass = tablePresets.headerCell;
  const columnCount = 5;
  const items = initiatives.data;

  return (
    <TableCard header={header}>
      <SystemTable layout="auto">
        <TableHeader>
          <TableHeaderRow className="min-w-0">
            <TableHead
              className={cn(baseClass, 'w-full min-w-0')}
              aria-sort={resolveAriaSort(sort, 'name', sortableColumns)}
            >
              <TableSortHeader
                column="name"
                label={tForm('fields.name.label')}
                srLabel={tForm('fields.name.label')}
                sort={sort}
                disabled={!isColumnSortable('name', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>

            <TableHead
              className={cn(
                baseClass,
                'hidden w-px whitespace-nowrap text-left xs:table-cell',
              )}
              aria-sort={resolveAriaSort(sort, 'start_date', sortableColumns)}
            >
              <TableSortHeader
                column="start_date"
                label={tForm('fields.period.label')}
                srLabel={tForm('fields.period.label')}
                sort={sort}
                disabled={!isColumnSortable('start_date', sortableColumns)}
                onToggleSort={onSortChange}
                truncateLabel={false}
              />
            </TableHead>

            <TableHead
              className={cn(
                baseClass,
                'w-px text-center whitespace-nowrap sm:text-left',
              )}
              aria-sort={resolveAriaSort(sort, 'display', sortableColumns)}
            >
              <TableSortHeader
                column="display"
                label={
                  <>
                    <Eye className="h-3.5 w-3.5 sm:hidden" />
                    <span className="hidden sm:inline">
                      {tForm('fields.visibility.label')}
                    </span>
                  </>
                }
                srLabel={tForm('fields.visibility.label')}
                sort={sort}
                disabled={!isColumnSortable('display', sortableColumns)}
                onToggleSort={onSortChange}
                truncateLabel={false}
                labelClassName="inline-flex items-center"
              />
            </TableHead>

            <TableHead
              className={cn(
                baseClass,
                'hidden w-px whitespace-nowrap text-center align-middle md:table-cell',
              )}
              aria-sort={resolveAriaSort(sort, 'image_count', sortableColumns)}
            >
              <TableSortHeader
                column="image_count"
                label={tForm('fields.image_count.label')}
                srLabel={tForm('fields.image_count.label')}
                sort={sort}
                disabled={!isColumnSortable('image_count', sortableColumns)}
                onToggleSort={onSortChange}
                className="justify-center"
                truncateLabel={false}
              />
            </TableHead>

            <TableHead
              className={cn(baseClass, 'w-px whitespace-nowrap text-right')}
            >
              <span className="sr-only">{tForm('table.menu')}</span>
            </TableHead>
          </TableHeaderRow>
        </TableHeader>

        <TableBody>
          {items.length === 0 ? (
            <TableEmptyState
              colSpan={columnCount}
              message={emptyStateMessage ?? tForm('emptyState.description')}
            />
          ) : null}

          {items.map((initiative) => (
            <InitiativesRow
              key={initiative.id}
              initiative={initiative}
              onRowClick={onRowClick}
              onToggleDisplay={onToggleDisplay}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </SystemTable>

      <TablePagination
        pagination={initiatives}
        onPageChange={onPageChange}
        perPageOptions={perPageOptions}
        onPerPageChange={onPerPageChange}
        showPageLinks
      />
    </TableCard>
  );
}

function resolveAriaSort(
  sort: TableSortState,
  column: InitiativesSortKey,
  sortableColumns: Partial<Record<InitiativesSortKey, boolean>>,
): 'ascending' | 'descending' | 'none' {
  if (!isColumnSortable(column, sortableColumns)) {
    return 'none';
  }

  if (sort.column !== column) {
    return 'none';
  }

  return sort.direction === 'asc' ? 'ascending' : 'descending';
}

function isColumnSortable(
  column: InitiativesSortKey,
  sortableColumns: Partial<Record<InitiativesSortKey, boolean>>,
): boolean {
  return sortableColumns[column] !== false;
}
