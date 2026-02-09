import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

import { Button } from '@/Components/Ui/button';
import {
  PageFilters,
  PageTable,
} from '@/Modules/ContentManagement/features/page-management/page';
import {
  buildPageListQueryParams,
  normalizePageListFilters,
  type PageListFilters as PageListFiltersType,
} from '@/Modules/ContentManagement/features/page-management/page/filtering';
import type { PageIndexViewModelProps } from '@/Modules/ContentManagement/types';
import { Plus } from 'lucide-react';

export default function PageIndex({
  pages,
  filters,
  extra,
}: PageIndexViewModelProps) {
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

        <PageTable
          pages={pages}
          homeSlug={
            typeof extra.homeSlug === 'string' ? extra.homeSlug : undefined
          }
        />
      </div>
    </AuthenticatedLayout>
  );
}
