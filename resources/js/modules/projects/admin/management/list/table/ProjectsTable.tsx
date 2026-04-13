import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { ProjectListItem } from '../types';
import type { ReactNode } from 'react';

import {
  SystemTable,
  TableCard,
  TableEmptyState,
  TableHeaderRow,
  TablePagination,
  tablePresets,
  TableSortHeader,
  type TablePaginated,
  type TableSortState,
} from '@/common/table';
import { TableBody, TableHead, TableHeader } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { ProjectsRow } from './ProjectsRow';

type ProjectsSortKey = 'name' | 'status' | 'display' | 'image_count';

interface ProjectsTableProps {
  projects: TablePaginated<ProjectListItem>;
  onRowClick(project: ProjectListItem): void;
  onDelete(project: ProjectListItem, event?: React.MouseEvent): void;
  header?: ReactNode;
  emptyStateMessage?: ReactNode;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSortChange?: (column: string) => void;
  perPageOptions?: readonly number[];
  sort?: TableSortState;
  sortableColumns?: Partial<Record<ProjectsSortKey, boolean>>;
}

export function ProjectsTable({
  projects,
  onRowClick,
  onDelete,
  header,
  emptyStateMessage,
  onPageChange,
  onPerPageChange,
  onSortChange,
  perPageOptions,
  sort = { column: null, direction: null },
  sortableColumns = {},
}: ProjectsTableProps) {
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const baseClass = tablePresets.headerCell;
  const columnCount = 5;
  const items = projects.data;

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
                'xs:table-cell hidden w-px text-left whitespace-nowrap',
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
                'hidden w-px text-center align-middle whitespace-nowrap md:table-cell',
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
              className={cn(baseClass, 'w-px text-right whitespace-nowrap')}
            >
              <span className="sr-only">{tForm('fields.actions.label')}</span>
            </TableHead>
          </TableHeaderRow>
        </TableHeader>

        <TableBody>
          {items.length === 0 ? (
            <TableEmptyState
              colSpan={columnCount}
              message={emptyStateMessage ?? tForm('emptyState.index')}
            />
          ) : null}

          {items.map((project) => (
            <ProjectsRow
              key={project.id}
              project={project}
              onRowClick={onRowClick}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </SystemTable>

      <TablePagination
        pagination={projects}
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
  column: ProjectsSortKey,
  sortableColumns: Partial<Record<ProjectsSortKey, boolean>>,
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
  column: ProjectsSortKey,
  sortableColumns: Partial<Record<ProjectsSortKey, boolean>>,
): boolean {
  return sortableColumns[column] !== false;
}
