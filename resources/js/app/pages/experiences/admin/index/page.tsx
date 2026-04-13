import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { SearchField } from '@/common/filtering';
import { PageHead, pageRouter, useCurrentPage } from '@/common/page-runtime';
import {
  NewButton,
  serializeTableQueryParams,
  setTablePageInQueryParams,
  setTablePerPageInQueryParams,
  setTableSortInQueryParams,
  TableToolbar,
  toggleTableSortState,
  type TablePaginated,
  type TableSortState,
} from '@/common/table';
import { Button } from '@/components/ui/button';
import type { Experience } from '@/modules/experiences/core/types';
import {
  EXPERIENCES_NAMESPACES,
  useExperiencesTranslation,
} from '@/modules/experiences/i18n';
import { ExperienceOverlay } from '@/modules/experiences/ui/ExperienceOverlay';
import { ExperiencesTable } from '@/modules/experiences/ui/table/ExperiencesTable';
import { useEffect, useState } from 'react';

interface ExperiencesIndexProps {
  experiences: TablePaginated<Experience>;
  filters: {
    per_page?: number | null;
    search?: string | null;
    visibility?: string | null;
    sort?: string | null;
    direction?: string | null;
  };
}

const EXPERIENCE_PER_PAGE_OPTIONS = [15, 30, 50] as const;
const EXPERIENCE_DEFAULT_SORT_DIRECTION = 'desc' as const;
const EXPERIENCE_SORTABLE_COLUMNS = {
  position: true,
  company: true,
  start_date: true,
  display: true,
} as const;

export default function Index({ experiences, filters }: ExperiencesIndexProps) {
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const currentPage = useCurrentPage();
  const { translate: tActions } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.actions,
  );
  const { translate: tSections } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.sections,
  );
  const { translate: tForm } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.form,
  );
  const appliedSearch =
    typeof filters.search === 'string' ? filters.search : '';
  const appliedVisibility =
    typeof filters.visibility === 'string' ? filters.visibility : '';
  const currentSortColumn =
    typeof filters.sort === 'string' ? filters.sort : null;
  const sortState: TableSortState = {
    column: currentSortColumn,
    direction:
      filters.direction === 'asc' || filters.direction === 'desc'
        ? filters.direction
        : currentSortColumn !== null
          ? EXPERIENCE_DEFAULT_SORT_DIRECTION
          : null,
  };
  const currentPerPage =
    typeof filters.per_page === 'number' && filters.per_page > 0
      ? filters.per_page
      : experiences.per_page;
  const [draftSearch, setDraftSearch] = useState(appliedSearch);
  const [draftVisibility, setDraftVisibility] = useState(appliedVisibility);
  const hasAppliedFilters = appliedSearch !== '' || appliedVisibility !== '';

  useEffect(() => {
    setDraftSearch(appliedSearch);
    setDraftVisibility(appliedVisibility);
  }, [appliedSearch, appliedVisibility, currentPage.url]);

  const handlePageChange = (page: number): void => {
    pageRouter.get(
      route('experiences.index'),
      setTablePageInQueryParams(
        buildExperiencesIndexQueryParams({
          search: appliedSearch,
          visibility: appliedVisibility,
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
      route('experiences.index'),
      setTablePerPageInQueryParams(
        buildExperiencesIndexQueryParams({
          search: appliedSearch,
          visibility: appliedVisibility,
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
      route('experiences.index'),
      setTableSortInQueryParams(
        serializeTableQueryParams({
          per_page: currentPerPage,
          search: appliedSearch,
          visibility: appliedVisibility,
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

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    pageRouter.get(
      route('experiences.index'),
      buildExperiencesIndexQueryParams({
        search: draftSearch,
        visibility: draftVisibility,
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
    setDraftVisibility('');

    pageRouter.get(
      route('experiences.index'),
      buildExperiencesIndexQueryParams({
        search: '',
        visibility: '',
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
      <PageHead title={tSections('managementTitle')} />

      <PageContent className="overflow-hidden py-8" pageWidth="container">
        <div className="mb-6">
          <div>
            <h1 className="text-xl leading-tight font-semibold">
              {tSections('managementTitle')}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {tForm('help.managementSubtitle')}
            </p>
          </div>
        </div>

        <ExperiencesTable
          experiences={experiences}
          onRowClick={(experience) => setSelectedExperience(experience)}
          header={
            <TableToolbar className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <form
                className="flex w-full flex-col gap-3 md:flex-row md:items-center"
                onSubmit={handleSearchSubmit}
              >
                <SearchField
                  className="w-full md:max-w-md"
                  aria-label={tForm('filters.searchLabel')}
                  value={draftSearch}
                  onChange={(event) =>
                    setDraftSearch(event.currentTarget.value)
                  }
                  placeholder={tForm('filters.searchPlaceholder')}
                  buttonLabel={tForm('filters.searchSubmit')}
                />

                <select
                  aria-label={tForm('filters.visibilityLabel')}
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-xs"
                  value={draftVisibility}
                  onChange={(event) =>
                    setDraftVisibility(event.currentTarget.value)
                  }
                >
                  <option value="">{tForm('filters.visibilityPlaceholder')}</option>
                  <option value="public">{tForm('filters.publicOnly')}</option>
                  <option value="private">{tForm('filters.privateOnly')}</option>
                </select>
              </form>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {hasAppliedFilters ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                  >
                    {tForm('filters.reset')}
                  </Button>
                ) : null}

                <NewButton
                  href={route('experiences.create')}
                  label={tActions('newExperience')}
                />
              </div>
            </TableToolbar>
          }
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSortChange={handleSortChange}
          perPageOptions={EXPERIENCE_PER_PAGE_OPTIONS}
          sort={sortState}
          sortableColumns={EXPERIENCE_SORTABLE_COLUMNS}
        />

        <ExperienceOverlay
          open={selectedExperience !== null}
          experience={selectedExperience}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedExperience(null);
            }
          }}
        />
      </PageContent>
    </AuthenticatedLayout>
  );
}

Index.i18n = ['experiences'];

function buildExperiencesIndexQueryParams({
  search,
  visibility,
  perPage,
  sort,
}: {
  search: string;
  visibility: string;
  perPage?: number;
  sort: TableSortState;
}): Record<string, string> {
  return setTableSortInQueryParams(
    serializeTableQueryParams({
      search,
      visibility,
      per_page: perPage,
    }),
    sort,
  );
}
