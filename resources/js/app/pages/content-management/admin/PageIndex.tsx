import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

import { Button } from '@/Components/Ui/button';
import { PageFilters } from '@/Modules/ContentManagement/features/page-management/page/PageFilters';
import { PageTable } from '@/Modules/ContentManagement/features/page-management/page/PageTable';
import type { PageIndexViewModelProps } from '@/Modules/ContentManagement/types';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

export default function PageIndex({
  pages,
  filters,
  extra,
}: PageIndexViewModelProps) {
  const currentStatus =
    typeof filters.status === 'string' ? filters.status : '';

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
          initialStatus={currentStatus}
          // search is kept in filters for future use
          initialSearch={
            typeof filters.search === 'string' ? filters.search : ''
          }
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
