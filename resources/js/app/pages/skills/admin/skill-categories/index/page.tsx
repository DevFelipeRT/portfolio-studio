import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead, PageLink, pageRouter } from '@/common/page-runtime';
import {
  NewButton,
  serializeTableQueryParams,
  setTablePageInQueryParams,
  setTablePerPageInQueryParams,
  setTableSortInQueryParams,
  TableSearchField,
  TableToolbar,
  type TablePaginated,
  toggleTableSortState,
  type TableSortState,
} from '@/common/table';
import { Button } from '@/components/ui/button';
import type { AdminSkillCategoryRecord } from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';
import { SkillCategoriesTable } from '@/modules/skills/ui/table/SkillCategoriesTable';
import { type FormEvent, useEffect, useState } from 'react';

interface SkillCategoriesIndexProps {
  categories: TablePaginated<AdminSkillCategoryRecord>;
  filters: {
    per_page?: number | null;
    search?: string | null;
    sort?: string | null;
    direction?: string | null;
  };
}

const CATEGORY_PER_PAGE_OPTIONS = [15, 30, 50] as const;
const CATEGORY_SORTABLE_COLUMNS = {
  name: true,
  slug: true,
  updated_at: true,
} as const;

export default function Index({
  categories,
  filters,
}: SkillCategoriesIndexProps) {
  const { translate: tActions } = useSkillsTranslation(
    SKILLS_NAMESPACES.actions,
  );
  const { translate: tSections } = useSkillsTranslation(
    SKILLS_NAMESPACES.sections,
  );
  const { translate: tForm } = useSkillsTranslation(SKILLS_NAMESPACES.form);
  const appliedSearch =
    typeof filters.search === 'string' ? filters.search : '';
  const sortState: TableSortState = {
    column: typeof filters.sort === 'string' ? filters.sort : null,
    direction:
      filters.direction === 'asc' || filters.direction === 'desc'
        ? filters.direction
        : null,
  };
  const currentPerPage =
    typeof filters.per_page === 'number' && filters.per_page > 0
      ? filters.per_page
      : categories.per_page;
  const hasAppliedFilters = appliedSearch !== '';
  const emptyStateMessage = hasAppliedFilters
    ? tForm('emptyState.filteredCategories')
    : tForm('emptyState.categories');
  const [draftSearch, setDraftSearch] = useState(appliedSearch);

  // Keep the form draft aligned with the applied table query after navigation.
  useEffect(() => {
    setDraftSearch(appliedSearch);
  }, [appliedSearch]);

  const handlePageChange = (page: number): void => {
    pageRouter.get(
      route('skill-categories.index'),
      setTablePageInQueryParams(
        buildSkillCategoriesIndexQueryParams({
          search: appliedSearch,
          perPage: currentPerPage,
          sort: sortState,
        }),
        page,
      ),
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const handlePerPageChange = (perPage: number): void => {
    pageRouter.get(
      route('skill-categories.index'),
      setTablePerPageInQueryParams(
        buildSkillCategoriesIndexQueryParams({
          search: appliedSearch,
          sort: sortState,
        }),
        perPage,
      ),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  const handleSortChange = (column: string): void => {
    pageRouter.get(
      route('skill-categories.index'),
      setTableSortInQueryParams(
        serializeTableQueryParams({
          per_page: currentPerPage,
          search: appliedSearch,
        }),
        toggleTableSortState(sortState, column),
      ),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    pageRouter.get(
      route('skill-categories.index'),
      buildSkillCategoriesIndexQueryParams({
        search: draftSearch,
        perPage: currentPerPage,
        sort: sortState,
      }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  const handleResetFilters = (): void => {
    setDraftSearch('');

    pageRouter.get(
      route('skill-categories.index'),
      buildSkillCategoriesIndexQueryParams({
        search: '',
        perPage: currentPerPage,
        sort: sortState,
      }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  return (
    <AuthenticatedLayout>
      <PageHead title={tSections('categoriesManagementTitle')} />

      <PageContent className="overflow-hidden py-8" pageWidth="container">
        <div className="mb-6 space-y-4">
          <PageLink
            href={route('skills.index')}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            {tActions('backToIndex')}
          </PageLink>

          <div>
            <h1 className="text-xl leading-tight font-semibold">
              {tSections('categoriesManagementTitle')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {tForm('help.categoriesDescription')}
            </p>
          </div>
        </div>

        <SkillCategoriesTable
          paginatedCategories={categories}
          emptyStateMessage={emptyStateMessage}
          deleteQuery={buildSkillCategoriesIndexQueryParams({
            search: appliedSearch,
            perPage: currentPerPage,
            sort: sortState,
            page: categories.current_page,
          })}
          header={
            <TableToolbar className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <form
                className="w-full sm:max-w-md"
                onSubmit={handleSearchSubmit}
              >
                <TableSearchField
                  aria-label={tForm('filters.categoriesSearchLabel')}
                  value={draftSearch}
                  onChange={(event) =>
                    setDraftSearch(event.currentTarget.value)
                  }
                  placeholder={tForm('filters.categoriesSearchPlaceholder')}
                  buttonLabel={tForm('filters.categoriesSearchSubmit')}
                />
              </form>

              <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                {hasAppliedFilters ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={handleResetFilters}
                  >
                    {tForm('filters.reset')}
                  </Button>
                ) : null}

                <NewButton
                  href={route('skill-categories.create')}
                  label={tActions('newCategory')}
                  className="w-full justify-center sm:w-auto"
                />
              </div>
            </TableToolbar>
          }
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSortChange={handleSortChange}
          perPageOptions={CATEGORY_PER_PAGE_OPTIONS}
          sort={sortState}
          sortableColumns={CATEGORY_SORTABLE_COLUMNS}
        />
      </PageContent>
    </AuthenticatedLayout>
  );
}

Index.i18n = ['skills'];

function buildSkillCategoriesIndexQueryParams({
  search,
  perPage,
  sort,
  page,
}: {
  search: string;
  perPage?: number;
  sort: TableSortState;
  page?: number;
}): Record<string, string> {
  const query = setTableSortInQueryParams(
    serializeTableQueryParams({
      search,
      per_page: perPage,
    }),
    sort,
  );

  return page && page > 1 ? setTablePageInQueryParams(query, page) : query;
}
