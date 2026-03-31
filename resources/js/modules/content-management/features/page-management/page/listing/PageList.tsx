import { useGetLocale } from '@/common/locale';
import {
  formatTableDate,
  InteractiveTableRow,
  SystemTable,
  TableActionCell,
  TableCard,
  TableEmptyState,
  TableHeaderRow,
  TableMetaCell,
  TablePagination,
  TableSortHeader,
  TableTitleCell,
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
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import type { PageListSortKey } from '@/modules/content-management/features/page-management/page/filtering';
import type { PageDto, Paginated } from '@/modules/content-management/types';
import type { ReactNode } from 'react';

import { canSetAsHome, isHomePage, publicPageUrl } from './rules';
import { PageActions } from './partials/PageActions';
import { PageSlug } from './partials/PageSlug';
import { StatusBadge } from './partials/StatusBadge';

interface PageListProps {
  pages: Paginated<PageDto>;
  sort: TableSortState;
  sortableColumns?: Partial<Record<PageListSortKey, boolean>>;
  header?: ReactNode;
  homeSlug?: string;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: readonly number[];
  onSortChange?: (column: string) => void;
  /**
   * Called when a row is activated (click, Enter, Space). The parent should
   * typically open an info modal for the selected page.
   */
  onShowInfo?: (page: PageDto) => void;
}

/**
 * Admin listing for content-managed pages.
 *
 * UX notes:
 * - Rows are keyboard-accessible (`tabIndex=0`) and activate on Enter/Space.
 * - Inline actions stop propagation so they do not trigger the row handler.
 * - Mobile keeps secondary actions inside the dropdown menu.
 */
export function PageList({
  pages,
  sort,
  sortableColumns = {},
  header,
  homeSlug,
  onPageChange,
  onPerPageChange,
  perPageOptions,
  onSortChange,
  onShowInfo,
}: PageListProps) {
  const hasItems = pages.data.length > 0;
  const locale = useGetLocale();
  const { translate: tPages } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.pages,
  );
  const columnCount = 7;
  const baseClass = tablePresets.headerCell;

  return (
    <TableCard header={header}>
      <SystemTable layout="fixed">
        <TableHeader>
          <TableHeaderRow>
            <TableHead
              className={cn(baseClass, 'w-[22%]')}
              aria-sort={resolveAriaSort(sort, 'name', sortableColumns)}
            >
              <TableSortHeader
                column="name"
                label={tPages('listing.columns.name', 'Name')}
                srLabel={tPages('listing.columns.name', 'Name')}
                sort={sort}
                disabled={!isColumnSortable('name', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>
            <TableHead
              className={cn(baseClass, 'w-[24%]')}
              aria-sort={resolveAriaSort(sort, 'title', sortableColumns)}
            >
              <TableSortHeader
                column="title"
                label={tPages('listing.columns.title', 'Title')}
                srLabel={tPages('listing.columns.title', 'Title')}
                sort={sort}
                disabled={!isColumnSortable('title', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>
            <TableHead
              className={baseClass}
              aria-sort={resolveAriaSort(sort, 'slug', sortableColumns)}
            >
              <TableSortHeader
                column="slug"
                label={tPages('listing.columns.slug', 'Slug')}
                srLabel={tPages('listing.columns.slug', 'Slug')}
                sort={sort}
                disabled={!isColumnSortable('slug', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>
            <TableHead
              className={cn(baseClass, 'hidden md:table-cell')}
              aria-sort={resolveAriaSort(sort, 'locale', sortableColumns)}
            >
              <TableSortHeader
                column="locale"
                label={tPages('listing.columns.locale', 'Locale')}
                srLabel={tPages('listing.columns.locale', 'Locale')}
                sort={sort}
                disabled={!isColumnSortable('locale', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>
            <TableHead
              className={cn(
                baseClass,
                'hidden w-[7.5rem] whitespace-nowrap md:table-cell',
              )}
              aria-sort={resolveAriaSort(sort, 'status', sortableColumns)}
            >
              <TableSortHeader
                column="status"
                label={tPages('listing.columns.status', 'Status')}
                srLabel={tPages('listing.columns.status', 'Status')}
                sort={sort}
                disabled={!isColumnSortable('status', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>
            <TableHead
              className={cn(
                baseClass,
                'hidden w-[9.5rem] whitespace-nowrap lg:table-cell',
              )}
              aria-sort={resolveAriaSort(sort, 'updated_at', sortableColumns)}
            >
              <TableSortHeader
                column="updated_at"
                label={tPages('listing.columns.lastUpdated', 'Last updated')}
                srLabel={tPages('listing.columns.lastUpdated', 'Last updated')}
                sort={sort}
                disabled={!isColumnSortable('updated_at', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>
            <TableHead className={cn(baseClass, 'text-right')}>
              <span className="sr-only">
                {tPages('listing.columns.rowActions', 'Row actions')}
              </span>
            </TableHead>
          </TableHeaderRow>
        </TableHeader>

        <TableBody>
          {!hasItems && (
            <TableEmptyState
              colSpan={columnCount}
              message={tPages(
                'listing.empty',
                'No pages found for the current filters.',
              )}
            />
          )}

          {pages.data.map((page) => {
            const isHome = isHomePage(homeSlug, page.slug);
            const publicUrl = publicPageUrl(isHome, page.slug);
            const showSetHome = canSetAsHome(homeSlug, page.slug);
            const updatedLabel = formatTableDate(page.updated_at, {
              locale,
              fallback: '\u2014',
            });

            return (
              <InteractiveTableRow
                key={page.id}
                interactive={typeof onShowInfo === 'function'}
                onActivate={() => onShowInfo?.(page)}
              >
                <TableTitleCell
                  className="w-[22%]"
                  title={
                    <span className="font-mono text-xs">{page.internal_name}</span>
                  }
                />

                <TableTitleCell className="w-[24%]" title={page.title} />

                <TableMetaCell>
                  <PageSlug slug={page.slug} isHome={isHome} />
                </TableMetaCell>

                <TableMetaCell className="hidden uppercase md:table-cell">
                  {page.locale}
                </TableMetaCell>

                <TableMetaCell className="hidden md:table-cell">
                  <StatusBadge page={page} />
                </TableMetaCell>

                <TableMetaCell className="hidden whitespace-nowrap lg:table-cell">
                  <span>{updatedLabel}</span>
                </TableMetaCell>

                <TableActionCell
                  className={cn(tablePresets.actionCell, 'content-center')}
                >
                  <PageActions
                    pageId={page.id}
                    pageTitle={page.title}
                    publicUrl={publicUrl}
                    showSetHome={showSetHome}
                  />
                </TableActionCell>
              </InteractiveTableRow>
            );
          })}
        </TableBody>
      </SystemTable>

      <TablePagination
        pagination={pages}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
        perPageOptions={perPageOptions}
        showPageLinks
      />
    </TableCard>
  );
}

function resolveAriaSort(
  sort: TableSortState,
  column: string,
  sortableColumns: Partial<Record<PageListSortKey, boolean>>,
): 'ascending' | 'descending' | 'none' {
  if (!isColumnSortable(column as PageListSortKey, sortableColumns)) {
    return 'none';
  }

  if (sort.column !== column) {
    return 'none';
  }

  return sort.direction === 'desc' ? 'descending' : 'ascending';
}

function isColumnSortable(
  column: PageListSortKey,
  sortableColumns: Partial<Record<PageListSortKey, boolean>>,
): boolean {
  return sortableColumns[column] !== false;
}
