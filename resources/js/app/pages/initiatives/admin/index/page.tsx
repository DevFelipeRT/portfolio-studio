// resources/js/Pages/Initiatives/Index.tsx

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
import React, { useEffect, useState } from 'react';

import type { InitiativeListItem } from '@/modules/initiatives/core/types';
import { InitiativeHeader } from '@/modules/initiatives/ui/InitiativeHeader';
import {
  INITIATIVES_NAMESPACES,
  useInitiativesTranslation,
} from '@/modules/initiatives/i18n';
import { InitiativeOverlay } from '@/modules/initiatives/ui/overlay/InitiativeOverlay';
import { InitiativesTable } from '@/modules/initiatives/ui/table/InitiativesTable';

interface InitiativesIndexProps {
  initiatives: TablePaginated<InitiativeListItem>;
  filters: {
    per_page?: number | null;
    search?: string | null;
    display?: string | null;
    has_images?: string | null;
    sort?: string | null;
    direction?: string | null;
  };
  stats: {
    visible_count: number;
  };
}

const INITIATIVE_PER_PAGE_OPTIONS = [15, 30, 50] as const;
const INITIATIVE_SORTABLE_COLUMNS = {
  name: true,
  start_date: true,
  display: true,
  image_count: true,
} as const;

/**
 * Initiatives index page for listing and managing portfolio initiatives.
 */
export default function Index({
  initiatives,
  filters,
  stats,
}: InitiativesIndexProps) {
  const currentPage = useCurrentPage();
  const { translate: tActions } = useInitiativesTranslation(
    INITIATIVES_NAMESPACES.actions,
  );
  const { translate: tSections } = useInitiativesTranslation(
    INITIATIVES_NAMESPACES.sections,
  );
  const { translate: tForm } = useInitiativesTranslation(
    INITIATIVES_NAMESPACES.form,
  );
  const appliedSearch =
    typeof filters.search === 'string' ? filters.search : '';
  const appliedDisplayFilter =
    typeof filters.display === 'string' ? filters.display : '';
  const appliedHasImagesFilter =
    typeof filters.has_images === 'string' ? filters.has_images : '';
  const sortState: TableSortState = {
    column: typeof filters.sort === 'string' ? filters.sort : null,
    direction:
      filters.direction === 'asc' || filters.direction === 'desc'
        ? filters.direction
        : null,
  };
  const [selectedInitiative, setSelectedInitiative] =
    useState<InitiativeListItem | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [draftSearch, setDraftSearch] = useState(appliedSearch);
  const [draftDisplayFilter, setDraftDisplayFilter] =
    useState(appliedDisplayFilter);
  const [draftHasImagesFilter, setDraftHasImagesFilter] =
    useState(appliedHasImagesFilter);
  const currentPerPage =
    typeof filters.per_page === 'number' && filters.per_page > 0
      ? filters.per_page
      : initiatives.per_page;
  const hasAppliedFilters =
    appliedSearch !== '' ||
    appliedDisplayFilter !== '' ||
    appliedHasImagesFilter !== '';
  const emptyStateMessage =
    initiatives.total === 0
      ? hasAppliedFilters
        ? tForm('emptyState.filteredDescription')
        : tForm('emptyState.description')
      : tForm('emptyState.unavailableResults');

  useEffect(() => {
    setDraftSearch(appliedSearch);
    setDraftDisplayFilter(appliedDisplayFilter);
    setDraftHasImagesFilter(appliedHasImagesFilter);
  }, [
    appliedDisplayFilter,
    appliedHasImagesFilter,
    appliedSearch,
    currentPage.url,
  ]);

  function handleRowClick(initiative: InitiativeListItem): void {
    setSelectedInitiative(initiative);
    setOverlayOpen(true);
  }

  function handleOverlayChange(open: boolean): void {
    if (!open) {
      setOverlayOpen(false);
      setSelectedInitiative(null);
      return;
    }

    setOverlayOpen(true);
  }

  function handleToggleDisplay(
    initiative: InitiativeListItem,
    event?: React.MouseEvent,
  ): void {
    event?.stopPropagation();
    const nextDisplay = !initiative.display;
    setSelectedInitiative((current) =>
      current?.id === initiative.id ? { ...current, display: nextDisplay } : current,
    );

    pageRouter.patch(
      route('initiatives.toggle-display', initiative.id),
      {},
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  }

  function handleDelete(
    initiative: InitiativeListItem,
    event?: React.MouseEvent,
  ): void {
    event?.stopPropagation();

    if (!window.confirm(tActions('confirmDelete'))) {
      return;
    }

    pageRouter.delete(route('initiatives.destroy', initiative.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        if (selectedInitiative?.id === initiative.id) {
          setSelectedInitiative(null);
          setOverlayOpen(false);
        }
      },
    });
  }

  function handlePageChange(page: number): void {
    pageRouter.get(
      route('initiatives.index'),
      setTablePageInQueryParams(
        buildInitiativesIndexQueryParams({
          search: appliedSearch,
          display: appliedDisplayFilter,
          hasImages: appliedHasImagesFilter,
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
  }

  function handlePerPageChange(perPage: number): void {
    pageRouter.get(
      route('initiatives.index'),
      setTablePerPageInQueryParams(
        buildInitiativesIndexQueryParams({
          search: appliedSearch,
          display: appliedDisplayFilter,
          hasImages: appliedHasImagesFilter,
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
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    pageRouter.get(
      route('initiatives.index'),
      buildInitiativesIndexQueryParams({
        search: draftSearch,
        display: draftDisplayFilter,
        hasImages: draftHasImagesFilter,
        perPage: currentPerPage,
        sort: sortState,
      }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  }

  function handleResetFilters(): void {
    setDraftSearch('');
    setDraftDisplayFilter('');
    setDraftHasImagesFilter('');

    pageRouter.get(
      route('initiatives.index'),
      buildInitiativesIndexQueryParams({
        search: '',
        display: '',
        hasImages: '',
        perPage: currentPerPage,
        sort: sortState,
      }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  }

  function handleSortChange(column: string): void {
    pageRouter.get(
      route('initiatives.index'),
      setTableSortInQueryParams(
        serializeTableQueryParams({
          per_page: currentPerPage,
          search: appliedSearch,
          display: appliedDisplayFilter,
          has_images: appliedHasImagesFilter,
        }),
        toggleTableSortState(sortState, column),
      ),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  }

  return (
    <AuthenticatedLayout>
      <PageHead title={tSections('managementTitle')} />

      <PageContent
        className="space-y-4 overflow-hidden py-8"
        pageWidth="container"
      >
        <InitiativeHeader
          total={initiatives.total}
          visibleCount={stats.visible_count}
        />

        <InitiativesTable
          initiatives={initiatives}
          onRowClick={handleRowClick}
          onToggleDisplay={handleToggleDisplay}
          onDelete={handleDelete}
          header={
            <TableToolbar className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
                  value={draftDisplayFilter}
                  onChange={(event) =>
                    setDraftDisplayFilter(event.currentTarget.value)
                  }
                >
                  <option value="">{tForm('filters.visibilityPlaceholder')}</option>
                  <option value="visible">{tForm('filters.publicOnly')}</option>
                  <option value="hidden">{tForm('filters.privateOnly')}</option>
                </select>

                <select
                  aria-label={tForm('filters.imagePresenceLabel')}
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-muted-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-xs"
                  value={draftHasImagesFilter}
                  onChange={(event) =>
                    setDraftHasImagesFilter(event.currentTarget.value)
                  }
                >
                  <option value="">
                    {tForm('filters.imagePresencePlaceholder')}
                  </option>
                  <option value="with">{tForm('filters.withImages')}</option>
                  <option value="without">
                    {tForm('filters.withoutImages')}
                  </option>
                </select>
              </form>

              <div className="flex items-center gap-2 self-end lg:self-auto">
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
                  href={route('initiatives.create')}
                  label={tActions('newInitiative')}
                />
              </div>
            </TableToolbar>
          }
          emptyStateMessage={emptyStateMessage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSortChange={handleSortChange}
          perPageOptions={INITIATIVE_PER_PAGE_OPTIONS}
          sort={sortState}
          sortableColumns={INITIATIVE_SORTABLE_COLUMNS}
        />
      </PageContent>

      <InitiativeOverlay
        open={overlayOpen}
        initiative={selectedInitiative}
        onOpenChange={handleOverlayChange}
      />
    </AuthenticatedLayout>
  );
}

Index.i18n = ['initiatives'];

function buildInitiativesIndexQueryParams({
  search,
  display,
  hasImages,
  perPage,
  sort,
}: {
  search: string;
  display: string;
  hasImages: string;
  perPage?: number;
  sort: TableSortState;
}): Record<string, string> {
  return setTableSortInQueryParams(
    serializeTableQueryParams({
      search,
      display,
      has_images: hasImages,
      per_page: perPage,
    }),
    sort,
  );
}
