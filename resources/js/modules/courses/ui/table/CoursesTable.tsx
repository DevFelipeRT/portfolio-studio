import type { Course } from '@/modules/courses/core/types';
import type { ReactNode } from 'react';
import {
  COURSES_NAMESPACES,
  useCoursesTranslation,
} from '@/modules/courses/i18n';
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
import { Eye } from 'lucide-react';
import { CoursesRow } from './CoursesRow';

import { cn } from '@/lib/utils';

type CoursesSortKey =
  | 'name'
  | 'institution'
  | 'started_at'
  | 'completed_at'
  | 'status'
  | 'display';

interface CoursesTableProps {
  courses: TablePaginated<Course>;
  onRowClick: (course: Course) => void;
  header?: ReactNode;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSortChange?: (column: string) => void;
  perPageOptions?: readonly number[];
  sort?: TableSortState;
  sortableColumns?: Partial<Record<CoursesSortKey, boolean>>;
}

/**
 * CoursesTable renders the list of courses within a card container.
 */
export function CoursesTable({
  courses,
  onRowClick,
  header,
  onPageChange,
  onPerPageChange,
  onSortChange,
  perPageOptions,
  sort = { column: null, direction: null },
  sortableColumns = {},
}: CoursesTableProps) {
  const { translate: tForm } = useCoursesTranslation(COURSES_NAMESPACES.form);
  const baseClass = tablePresets.headerCell;
  const columnCount = 7;
  const items = courses.data;

  return (
    <TableCard header={header}>
      <SystemTable
        layout="auto"
        className="[&_td]:px-2 [&_td]:py-2 [&_th]:px-2 [&_th]:py-2 xs:[&_td]:px-3 xs:[&_td]:py-2 xs:[&_th]:px-3 xs:[&_th]:py-2 lg:[&_td]:px-4 lg:[&_td]:py-3 lg:[&_th]:px-4 lg:[&_th]:py-3"
      >
        <TableHeader>
          <TableHeaderRow className="min-w-0">
            <TableHead
              className={cn(baseClass, 'min-w-0')}
              aria-sort={resolveAriaSort(sort, 'name', sortableColumns)}
            >
              <TableSortHeader
                column="name"
                label={tForm('table.columns.name')}
                srLabel={tForm('table.columns.name')}
                sort={sort}
                disabled={!isColumnSortable('name', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>

            <TableHead
              className={cn(
                baseClass,
                'hidden whitespace-nowrap sm:table-cell',
              )}
              aria-sort={resolveAriaSort(sort, 'institution', sortableColumns)}
            >
              <TableSortHeader
                column="institution"
                label={tForm('fields.institution.label')}
                srLabel={tForm('fields.institution.label')}
                sort={sort}
                disabled={!isColumnSortable('institution', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>

            <TableHead
              className={cn(baseClass, 'hidden whitespace-nowrap lg:table-cell')}
              aria-sort={resolveAriaSort(sort, 'started_at', sortableColumns)}
            >
              <TableSortHeader
                column="started_at"
                label={tForm('table.columns.started_at')}
                srLabel={tForm('table.columns.started_at')}
                sort={sort}
                disabled={!isColumnSortable('started_at', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>

            <TableHead
              className={cn(baseClass, 'hidden whitespace-nowrap lg:table-cell')}
              aria-sort={resolveAriaSort(sort, 'completed_at', sortableColumns)}
            >
              <TableSortHeader
                column="completed_at"
                label={tForm('table.columns.completed_at')}
                srLabel={tForm('table.columns.completed_at')}
                sort={sort}
                disabled={!isColumnSortable('completed_at', sortableColumns)}
                onToggleSort={onSortChange}
              />
            </TableHead>

            <TableHead
              className={cn(
                baseClass,
                'hidden w-px whitespace-normal px-1 text-center align-middle md:table-cell md:px-2 md:text-left',
              )}
              aria-sort={resolveAriaSort(sort, 'status', sortableColumns)}
            >
              <TableSortHeader
                column="status"
                label={tForm('fields.status.label')}
                srLabel={tForm('fields.status.label')}
                sort={sort}
                disabled={!isColumnSortable('status', sortableColumns)}
                onToggleSort={onSortChange}
                className="justify-center md:justify-start"
                labelClassName="whitespace-normal text-center leading-tight md:text-left"
                truncateLabel={false}
              />
            </TableHead>

            <TableHead
              className={cn(
                baseClass,
                'w-px whitespace-normal px-1 text-center align-middle sm:px-2 sm:text-left',
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
                className="justify-center sm:justify-start"
                truncateLabel={false}
              />
            </TableHead>

            <TableHead className={cn(baseClass, 'w-px whitespace-nowrap text-right')}>
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

          {items.map((course) => (
            <CoursesRow
              key={course.id}
              course={course}
              onRowClick={onRowClick}
            />
          ))}
        </TableBody>
      </SystemTable>

      <TablePagination
        pagination={courses}
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
  column: CoursesSortKey,
  sortableColumns: Partial<Record<CoursesSortKey, boolean>>,
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
  column: CoursesSortKey,
  sortableColumns: Partial<Record<CoursesSortKey, boolean>>,
): boolean {
  return sortableColumns[column] !== false;
}
