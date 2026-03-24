import type { ContactChannel } from '@/modules/contact-channels/core/types';
import type { ReactNode } from 'react';
import {
  CONTACT_CHANNELS_NAMESPACES,
  useContactChannelsTranslation,
} from '@/modules/contact-channels/i18n';

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
import { TableBody, TableHead, TableHeader } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ContactChannelsRow } from './ContactChannelsRow';

type ContactChannelSortKey =
  | 'channel_type'
  | 'label'
  | 'value'
  | 'is_active'
  | 'sort_order';

interface ContactChannelsTableProps {
  channels: TablePaginated<ContactChannel>;
  onRowClick(channel: ContactChannel): void;
  header?: ReactNode;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSortChange?: (column: string) => void;
  perPageOptions?: readonly number[];
  sort?: TableSortState;
  sortableColumns?: Partial<Record<ContactChannelSortKey, boolean>>;
}

export function ContactChannelsTable({
  channels,
  onRowClick,
  header,
  onPageChange,
  onPerPageChange,
  onSortChange,
  perPageOptions,
  sort = { column: null, direction: null },
  sortableColumns = {},
}: ContactChannelsTableProps) {
  const { translate: tForm } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.form,
  );
  const baseClass = tablePresets.headerCell;
  const columnCount = 6;
  const items = channels.data;

  return (
    <TableCard header={header}>
      <div className="overflow-x-auto">
        <SystemTable className="min-w-[760px] table-auto" layout="auto">
          <TableHeader>
            <TableHeaderRow className="min-w-0">
              <TableHead
                className={cn(baseClass, 'w-32 min-w-0 sm:w-40')}
                aria-sort={resolveAriaSort(sort, 'channel_type', sortableColumns)}
              >
                <TableSortHeader
                  column="channel_type"
                  label={tForm('columns.type')}
                  srLabel={tForm('columns.type')}
                  sort={sort}
                  disabled={!isColumnSortable('channel_type', sortableColumns)}
                  onToggleSort={onSortChange}
                />
              </TableHead>
              <TableHead
                className={cn(baseClass, 'w-32 text-left sm:w-40')}
                aria-sort={resolveAriaSort(sort, 'label', sortableColumns)}
              >
                <TableSortHeader
                  column="label"
                  label={tForm('columns.label')}
                  srLabel={tForm('columns.label')}
                  sort={sort}
                  disabled={!isColumnSortable('label', sortableColumns)}
                  onToggleSort={onSortChange}
                />
              </TableHead>
              <TableHead
                className={cn(baseClass, 'min-w-[18rem] text-left')}
                aria-sort={resolveAriaSort(sort, 'value', sortableColumns)}
              >
                <TableSortHeader
                  column="value"
                  label={tForm('columns.value')}
                  srLabel={tForm('columns.value')}
                  sort={sort}
                  disabled={!isColumnSortable('value', sortableColumns)}
                  onToggleSort={onSortChange}
                />
              </TableHead>
              <TableHead
                className={cn(baseClass, 'w-24 text-left sm:w-28')}
                aria-sort={resolveAriaSort(sort, 'is_active', sortableColumns)}
              >
                <TableSortHeader
                  column="is_active"
                  label={tForm('columns.active')}
                  srLabel={tForm('columns.active')}
                  sort={sort}
                  disabled={!isColumnSortable('is_active', sortableColumns)}
                  onToggleSort={onSortChange}
                />
              </TableHead>
              <TableHead
                className={cn(baseClass, 'w-14 text-left sm:w-16')}
                aria-sort={resolveAriaSort(sort, 'sort_order', sortableColumns)}
              >
                <TableSortHeader
                  column="sort_order"
                  label={tForm('columns.order')}
                  srLabel={tForm('columns.order')}
                  sort={sort}
                  disabled={!isColumnSortable('sort_order', sortableColumns)}
                  onToggleSort={onSortChange}
                />
              </TableHead>
              <TableHead className={cn(baseClass, 'w-14 text-right')}>
                <span className="sr-only">{tForm('columns.actions')}</span>
              </TableHead>
            </TableHeaderRow>
          </TableHeader>

          <TableBody>
            {items.length === 0 ? (
              <TableEmptyState
                colSpan={columnCount}
                message={tForm('emptyState.index')}
              />
            ) : null}

            {items.map((channel) => (
              <ContactChannelsRow
                key={channel.id}
                channel={channel}
                onRowClick={onRowClick}
              />
            ))}
          </TableBody>
        </SystemTable>
      </div>

      <TablePagination
        pagination={channels}
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
  column: ContactChannelSortKey,
  sortableColumns: Partial<Record<ContactChannelSortKey, boolean>>,
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
  column: ContactChannelSortKey,
  sortableColumns: Partial<Record<ContactChannelSortKey, boolean>>,
): boolean {
  return sortableColumns[column] !== false;
}
