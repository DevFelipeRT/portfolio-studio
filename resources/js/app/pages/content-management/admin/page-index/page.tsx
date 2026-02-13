import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

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

  const initialFilters = normalizePageListFilters({
    status: filters.status,
    search: filters.search,
  });

  const handleApplyFilters = (nextFilters: PageListFiltersType): void => {
    router.get(
      route('admin.content.pages.index'),
      buildPageListQueryParams(nextFilters),
      {
        preserveState: true,
        replace: true,
      },
    );
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Content pages
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage content-managed pages, their metadata and section
              composition.
            </p>
          </div>

          <Button asChild className="gap-2">
            <Link href={route('admin.content.pages.create')}>
              <Plus className="h-4 w-4" />
              New page
            </Link>
          </Button>
        </div>
      }
    >
      <Head title="Content pages" />

      <div className="space-y-6">
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
      </div>

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
