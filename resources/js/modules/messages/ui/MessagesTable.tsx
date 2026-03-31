// resources/js/Pages/Messages/Partials/MessagesTable.tsx

import type { Message } from '@/modules/messages/core/types';
import type { ReactNode } from 'react';

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
import {
  MESSAGES_NAMESPACES,
  useMessagesTranslation,
} from '@/modules/messages/i18n';
import { MessagesRow } from './MessagesRow';

type MessagesSortKey = 'name' | 'seen' | 'important' | 'created_at';

interface MessagesTableProps {
  messages: TablePaginated<Message>;
  onRowClick(message: Message): void;
  onToggleImportant(message: Message, event?: React.MouseEvent): void;
  onToggleSeen(message: Message, event?: React.MouseEvent): void;
  onDelete(message: Message, event?: React.MouseEvent): void;
  header?: ReactNode;
  emptyStateMessage?: ReactNode;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSortChange?: (column: string) => void;
  perPageOptions?: readonly number[];
  sort?: TableSortState;
  sortableColumns?: Partial<Record<MessagesSortKey, boolean>>;
}

/**
 * MessagesTable renders the inbox table with headers and rows.
 */
export function MessagesTable({
  messages,
  onRowClick,
  onToggleImportant,
  onToggleSeen,
  onDelete,
  header,
  emptyStateMessage,
  onPageChange,
  onPerPageChange,
  onSortChange,
  perPageOptions,
  sort = { column: null, direction: null },
  sortableColumns = {},
}: MessagesTableProps) {
  const { translate: tMessages } = useMessagesTranslation(
    MESSAGES_NAMESPACES.messages,
  );
  const baseClass = cn(tablePresets.headerCell, 'text-nowrap');
  const columnCount = 6;
  const items = messages.data;

  return (
    <TableCard header={header}>
      <SystemTable className="min-w-[860px] table-auto" layout="auto">
        <TableHeader>
          <TableHeaderRow className="min-w-0">
            <TableHead
              className={cn(baseClass, 'min-w-0 sm:w-52')}
              aria-sort={resolveAriaSort(sort, 'name', sortableColumns)}
            >
              <TableSortHeader
                column="name"
                label={tMessages('table.columns.from')}
                srLabel={tMessages('table.columns.from')}
                sort={sort}
                disabled={!isColumnSortable('name', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>

            <TableHead
              className={cn(
                baseClass,
                'hidden min-w-[260px] sm:table-cell',
              )}
            >
              <span>{tMessages('table.columns.message')}</span>
            </TableHead>

            <TableHead
              className={cn(
                baseClass,
                'w-28 text-left sm:w-32',
              )}
              aria-sort={resolveAriaSort(sort, 'seen', sortableColumns)}
            >
              <TableSortHeader
                column="seen"
                label={tMessages('table.columns.status')}
                srLabel={tMessages('table.columns.status')}
                sort={sort}
                disabled={!isColumnSortable('seen', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>

            <TableHead
              className={cn(
                baseClass,
                'w-28 text-left sm:w-32',
              )}
              aria-sort={resolveAriaSort(sort, 'important', sortableColumns)}
            >
              <TableSortHeader
                column="important"
                label={tMessages('table.columns.priority')}
                srLabel={tMessages('table.columns.priority')}
                sort={sort}
                disabled={!isColumnSortable('important', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>

            <TableHead
              className={cn(
                baseClass,
                'w-24 text-right sm:w-28',
              )}
              aria-sort={resolveAriaSort(sort, 'created_at', sortableColumns)}
            >
              <TableSortHeader
                column="created_at"
                label={tMessages('table.columns.when')}
                srLabel={tMessages('table.columns.when')}
                sort={sort}
                disabled={!isColumnSortable('created_at', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>

            <TableHead
              className={cn(baseClass, 'w-21 text-right sm:w-24')}
            >
              <span className="sr-only">
                {tMessages('table.columns.menu')}
              </span>
            </TableHead>
          </TableHeaderRow>
        </TableHeader>

        <TableBody>
          {items.length === 0 ? (
            <TableEmptyState
              colSpan={columnCount}
              message={emptyStateMessage ?? tMessages('emptyState.description')}
            />
          ) : null}

          {items.map((message) => (
            <MessagesRow
              key={message.id}
              message={message}
              onRowClick={onRowClick}
              onToggleImportant={onToggleImportant}
              onToggleSeen={onToggleSeen}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </SystemTable>

      <TablePagination
        pagination={messages}
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
  column: MessagesSortKey,
  sortableColumns: Partial<Record<MessagesSortKey, boolean>>,
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
  column: MessagesSortKey,
  sortableColumns: Partial<Record<MessagesSortKey, boolean>>,
): boolean {
  return sortableColumns[column] !== false;
}
