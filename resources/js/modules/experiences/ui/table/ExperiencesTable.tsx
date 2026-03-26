import type { Experience } from '@/modules/experiences/core/types';
import type { ReactNode } from 'react';
import {
  EXPERIENCES_NAMESPACES,
  useExperiencesTranslation,
} from '@/modules/experiences/i18n';

import {
  TableEmptyState,
  SystemTable,
  TableCard,
  TableHeaderRow,
  TablePagination,
  TableSortHeader,
  type TablePaginated,
  type TableSortState,
  tablePresets,
} from '@/common/table';
import { TableBody, TableHead, TableHeader } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { ExperiencesRow } from './ExperiencesRow';

type ExperiencesSortKey =
  | 'position'
  | 'company'
  | 'start_date'
  | 'display';

interface ExperiencesTableProps {
  experiences: TablePaginated<Experience>;
  onRowClick(experience: Experience): void;
  header?: ReactNode;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSortChange?: (column: string) => void;
  perPageOptions?: readonly number[];
  sort?: TableSortState;
  sortableColumns?: Partial<Record<ExperiencesSortKey, boolean>>;
}

export function ExperiencesTable({
  experiences,
  onRowClick,
  header,
  onPageChange,
  onPerPageChange,
  onSortChange,
  perPageOptions,
  sort = { column: null, direction: null },
  sortableColumns = {},
}: ExperiencesTableProps) {
  const { translate: tForm } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.form,
  );
  const baseClass = tablePresets.headerCell;
  const columnCount = 4;
  const items = experiences.data;

  return (
    <TableCard header={header}>
      <SystemTable layout="auto">
        <TableHeader>
          <TableHeaderRow className="min-w-0">
            <TableHead
              className={cn(baseClass, 'w-full min-w-0')}
              aria-sort={resolveAriaSort(sort, 'position', sortableColumns)}
            >
              <TableSortHeader
                column="position"
                label={tForm('fields.position.label')}
                srLabel={tForm('fields.position.label')}
                sort={sort}
                disabled={!isColumnSortable('position', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>
            <TableHead
              className={cn(baseClass, 'hidden w-px text-left whitespace-nowrap md:table-cell')}
              aria-sort={resolveAriaSort(sort, 'company', sortableColumns)}
            >
              <TableSortHeader
                column="company"
                label={tForm('fields.company.label')}
                srLabel={tForm('fields.company.label')}
                sort={sort}
                disabled={!isColumnSortable('company', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>
            <TableHead
              className={cn(baseClass, 'hidden w-px text-left whitespace-nowrap xs:table-cell')}
              aria-sort={resolveAriaSort(sort, 'start_date', sortableColumns)}
            >
              <TableSortHeader
                column="start_date"
                label={tForm('fields.period.label')}
                srLabel={tForm('fields.period.label')}
                sort={sort}
                disabled={!isColumnSortable('start_date', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>
            <TableHead
              className={cn(baseClass, 'w-px text-center whitespace-nowrap sm:text-left')}
              aria-sort={resolveAriaSort(sort, 'display', sortableColumns)}
            >
              <TableSortHeader
                column="display"
                label={
                  <>
                    <Eye className="h-3.5 w-3.5 sm:hidden" aria-hidden="true" />
                    <span className="hidden sm:inline">
                      {tForm('fields.visibility.label')}
                    </span>
                  </>
                }
                srLabel={tForm('fields.visibility.label')}
                truncateLabel={false}
                labelClassName="inline-flex items-center"
                sort={sort}
                disabled={!isColumnSortable('display', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>
            <TableHead className={cn(baseClass, 'w-px text-right whitespace-nowrap')}>
              <span className="sr-only">{tForm('fields.actions.label')}</span>
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

          {items.map((experience) => (
            <ExperiencesRow
              key={experience.id}
              experience={experience}
              onRowClick={onRowClick}
            />
          ))}
        </TableBody>
      </SystemTable>

      <TablePagination
        pagination={experiences}
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
  column: ExperiencesSortKey,
  sortableColumns: Partial<Record<ExperiencesSortKey, boolean>>,
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
  column: ExperiencesSortKey,
  sortableColumns: Partial<Record<ExperiencesSortKey, boolean>>,
): boolean {
  return sortableColumns[column] !== false;
}
