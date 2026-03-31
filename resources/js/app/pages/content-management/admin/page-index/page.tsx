import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead, pageRouter } from '@/common/page-runtime';
import {
  NewButton,
  setTablePageInQueryParams,
  setTablePerPageInQueryParams,
  setTableSortInQueryParams,
  toggleTableSortState,
  type TableSortState,
} from '@/common/table';
import {
  PageFilters,
  PageInfoModal,
  PageList,
} from '@/modules/content-management/features/page-management/page';
import {
  buildPageListQueryParams,
  normalizePageListFilters,
  type PageListSortKey,
  type PageListFilters as PageListFiltersType,
} from '@/modules/content-management/features/page-management/page/filtering';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import type { PageIndexViewModelProps } from '@/modules/content-management/types';
import type { PageDto } from '@/modules/content-management/types';
import React from 'react';

const PAGE_PER_PAGE_OPTIONS = [15, 30, 50] as const;

export default function PageIndex({
  pages,
  filters,
  extra,
}: PageIndexViewModelProps) {
  const [infoPage, setInfoPage] = React.useState<PageDto | null>(null);
  const { translate: tPages } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.pages,
  );
  const { translate: tActions } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.actions,
  );

  const initialFilters = normalizePageListFilters({
    per_page: filters.per_page,
    status: filters.status,
    locale: filters.locale,
    search: filters.search,
    sort: filters.sort,
    direction: filters.direction,
  });

  const sortState: TableSortState = {
    column: initialFilters.sort,
    direction: initialFilters.direction,
  };
  const sortableColumns = normalizeSortableColumns(
    extra.sorting?.sortable_columns,
  );

  const handleApplyFilters = (nextFilters: PageListFiltersType): void => {
    pageRouter.get(
      route('admin.content.pages.index'),
      buildPageListQueryParams(nextFilters),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  const handlePageChange = (page: number): void => {
    pageRouter.get(
      route('admin.content.pages.index'),
      setTablePageInQueryParams(
        buildPageListQueryParams(initialFilters),
        page,
      ),
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const handleSortChange = (column: string): void => {
    pageRouter.get(
      route('admin.content.pages.index'),
      setTableSortInQueryParams(
        buildPageListQueryParams(initialFilters),
        toggleTableSortState(sortState, column),
      ),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  const handlePerPageChange = (perPage: number): void => {
    pageRouter.get(
      route('admin.content.pages.index'),
      setTablePerPageInQueryParams(
        buildPageListQueryParams(initialFilters),
        perPage,
      ),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  return (
    <AuthenticatedLayout>
      <PageHead title={tPages('index.headTitle', 'Content pages')} />

      <PageContent className="space-y-6 py-8" pageWidth="container">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {tPages('index.title', 'Content pages')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {tPages(
              'index.description',
              'Manage content-managed pages, their metadata and section composition.',
            )}
          </p>
        </div>

        <PageList
          pages={pages}
          sort={sortState}
          sortableColumns={sortableColumns}
          header={
            <PageFilters
              initialFilters={initialFilters}
              availableLocales={Array.isArray(extra.locales) ? extra.locales : []}
              actions={
                <NewButton
                  href={route('admin.content.pages.create')}
                  label={tActions('newPage', 'New page')}
                />
              }
              onApply={handleApplyFilters}
            />
          }
          homeSlug={
            typeof extra.homeSlug === 'string' ? extra.homeSlug : undefined
          }
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSortChange={handleSortChange}
          perPageOptions={PAGE_PER_PAGE_OPTIONS}
          onShowInfo={(page) => setInfoPage(page)}
        />
      </PageContent>

      <PageInfoModal
        open={Boolean(infoPage)}
        page={infoPage}
        onOpenChange={(open) => {
          if (!open) {
            setInfoPage(null);
          }
        }}
      />
    </AuthenticatedLayout>
  );
}

PageIndex.i18n = ['content-management'];

function normalizeSortableColumns(
  input: PageIndexViewModelProps['extra']['sorting'] extends {
    sortable_columns?: infer T;
  }
    ? T
    : unknown,
): Partial<Record<PageListSortKey, boolean>> {
  if (!input || typeof input !== 'object') {
    return {};
  }

  return input as Partial<Record<PageListSortKey, boolean>>;
}
