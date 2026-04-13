import {
  customAdminIndexFilter,
  stringAdminIndexFilter,
  useAdminIndexFilters,
} from '@/common/filtering';
import { useCurrentPage } from '@/common/page-runtime';
import { type TablePaginated, type TableSortState } from '@/common/table';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { ProjectListItem } from '../types';
import { buildProjectListQueryParams } from './queryParams';

type ProjectListFilters = {
  per_page?: number | null;
  search?: string | null;
  status?: string | null;
  visibility?: string | null;
  sort?: string | null;
  direction?: string | null;
};

type UseProjectListFiltersParams = {
  projects: TablePaginated<ProjectListItem>;
  statusValues: readonly string[];
  filters: ProjectListFilters;
};

function resolveProjectsPerPage(
  rawFilters: ProjectListFilters,
  defaultPerPage: number,
): number {
  return typeof rawFilters.per_page === 'number' && rawFilters.per_page > 0
    ? rawFilters.per_page
    : defaultPerPage;
}

function resolveProjectsSortState(
  rawFilters: ProjectListFilters,
): TableSortState {
  return {
    column: typeof rawFilters.sort === 'string' ? rawFilters.sort : null,
    direction:
      rawFilters.direction === 'asc' || rawFilters.direction === 'desc'
        ? rawFilters.direction
        : null,
  };
}

function resolveProjectStatusFilter(
  statusValues: readonly string[],
  value: string | null | undefined,
): string {
  return typeof value === 'string' && statusValues.includes(value) ? value : '';
}

/**
 * Encapsulates the query-driven state for the Projects admin list,
 * including draft filters, applied filters, sorting, and pagination handlers.
 */
export function useProjectListFilters({
  projects,
  statusValues,
  filters,
}: UseProjectListFiltersParams) {
  const currentPage = useCurrentPage();
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const statusOptions = statusValues.map((value) => ({
    value,
    label: tForm(`status.${value}`, value),
  }));

  const filterDefinitions = {
    search: stringAdminIndexFilter<ProjectListFilters>(
      (rawFilters) => rawFilters.search,
    ),
    status: customAdminIndexFilter<ProjectListFilters, string>({
      fromRawFilters: (rawFilters) =>
        resolveProjectStatusFilter(
          statusValues,
          typeof rawFilters.status === 'string' ? rawFilters.status : null,
        ),
      emptyValue: '',
      isApplied: (value) => value !== '',
    }),
    visibility: stringAdminIndexFilter<ProjectListFilters>(
      (rawFilters) => rawFilters.visibility,
    ),
  } as const;
  const filtering = useAdminIndexFilters<
    ProjectListFilters,
    typeof filterDefinitions
  >({
    routeName: 'projects.index',
    rawFilters: filters,
    syncKey: currentPage.url ?? '',
    defaultPerPage: projects.per_page,
    filterDefinitions,
    resolvePerPage: resolveProjectsPerPage,
    resolveSortState: resolveProjectsSortState,
    buildQueryParams: ({ filters: nextFilters, perPage, sort }) =>
      buildProjectListQueryParams({
        search: nextFilters.search,
        status: nextFilters.status,
        visibility: nextFilters.visibility,
        perPage,
        sort,
      }),
  });

  return {
    draftFilters: filtering.draftFilters,
    hasAppliedFilters: filtering.hasAppliedFilters,
    statusOptions,
    emptyStateMessage: filtering.hasAppliedFilters
      ? tForm('emptyState.filteredDescription')
      : tForm('emptyState.index'),
    sortState: filtering.sortState,
    setDraftValue: filtering.setDraftValue,
    applyPartialDraftFilters: filtering.applyPartialDraftFilters,
    handleSubmit: filtering.handleSubmit,
    handleReset: filtering.handleReset,
    handlePageChange: filtering.handlePageChange,
    handlePerPageChange: filtering.handlePerPageChange,
    handleSortChange: filtering.handleSortChange,
  };
}
