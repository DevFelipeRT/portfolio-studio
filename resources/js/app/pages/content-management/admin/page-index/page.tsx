import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead, PageLink, pageRouter } from '@/common/page-runtime';

import { Button } from '@/components/ui/button';
import {
  PageFilters,
  PageInfoModal,
  PageList,
} from '@/modules/content-management/features/page-management/page';
import {
  buildPageListQueryParams,
  normalizePageListFilters,
  type PageListFilters as PageListFiltersType,
} from '@/modules/content-management/features/page-management/page/filtering';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import type { PageIndexViewModelProps } from '@/modules/content-management/types';
import type { PageDto } from '@/modules/content-management/types';
import { Plus } from 'lucide-react';
import React from 'react';

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
    status: filters.status,
    search: filters.search,
  });

  const handleApplyFilters = (nextFilters: PageListFiltersType): void => {
    pageRouter.get(
      route('admin.content.pages.index'),
      buildPageListQueryParams(nextFilters),
      {
        preserveState: true,
        replace: true,
      },
    );
  };

  return (
    <AuthenticatedLayout>
      <PageHead title={tPages('index.headTitle', 'Content pages')} />

      <PageContent className="space-y-6 py-8" pageWidth="container">
        <div className="flex items-center justify-between gap-3">
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

          <Button asChild className="gap-2">
            <PageLink href={route('admin.content.pages.create')}>
              <Plus className="h-4 w-4" />
              {tActions('newPage', 'New page')}
            </PageLink>
          </Button>
        </div>

        <PageFilters
          initialFilters={initialFilters}
          onApply={handleApplyFilters}
        />

        <PageList
          pages={pages}
          homeSlug={
            typeof extra.homeSlug === 'string' ? extra.homeSlug : undefined
          }
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
