// resources/js/Pages/Images/Index.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import type { Image } from '@/modules/images/core/types';
import {
  ImageFilters,
  type ImageFiltersValues,
} from '@/modules/images/ui/ImageFilters';
import { ImageHeader } from '@/modules/images/ui/ImageHeader';
import { ImageList } from '@/modules/images/ui/ImageList';
import { ImagePreviewDialog } from '@/modules/images/ui/ImagePreviewDialog';
import { ImagesEmptyState } from '@/modules/images/ui/ImagesEmptyState';

interface ImagesIndexFilters {
  search: string | null;
  usage: string | null;
  mime_type: string | null;
  storage_disk: string | null;
  per_page: string | number | null;
}

interface ImagesIndexPagination<TItem> {
  data: TItem[];

  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
  total: number;
}

interface ImagesIndexProps {
  images: ImagesIndexPagination<Image>;
  filters: ImagesIndexFilters;
}

/**
 * Global images index page, integrating filters, list, actions and preview modal.
 */
export default function Index({ images, filters }: ImagesIndexProps) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const hasItems = images.data.length > 0;

  const pagination = normalizePagination(images);

  const handleItemClick = (image: Image) => {
    setSelectedImage(image);
    setPreviewOpen(true);
  };

  const handleViewFromActions = (image: Image) => {
    setSelectedImage(image);
    setPreviewOpen(true);
  };

  const handlePreviewOpenChange = (open: boolean) => {
    setPreviewOpen(open);
    if (!open) {
      setSelectedImage(null);
    }
  };

  const handleDeleteFromActions = (image: Image) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this image? This action cannot be undone.',
    );

    if (!confirmed) {
      return;
    }

    router.delete(route('images.destroy', image.id), {
      preserveScroll: true,
      onSuccess: () => {
        if (selectedImage && selectedImage.id === image.id) {
          setSelectedImage(null);
          setPreviewOpen(false);
        }
      },
    });
  };

  const handleApplyFilters = (values: ImageFiltersValues) => {
    const payload: Record<string, string> = {
      search: values.search.trim(),
      usage: values.usage,
      mime_type: values.mime_type.trim(),
      storage_disk: values.storage_disk.trim(),
      per_page: values.per_page.trim(),
    };

    router.get(route('images.index'), payload, {
      preserveScroll: true,
      preserveState: true,
      replace: true,
    });
  };

  const handleResetFilters = () => {
    router.get(
      route('images.index'),
      {},
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
      },
    );
  };

  const handlePageChange = (page: number) => {
    const query = buildFilterQueryFromProps(filters);
    router.get(
      route('images.index'),
      {
        ...query,
        page,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const initialFilterValues: ImageFiltersValues = {
    search: filters.search ?? '',
    usage: filters.usage ?? '',
    mime_type: filters.mime_type ?? '',
    storage_disk: filters.storage_disk ?? '',
    per_page:
      typeof filters.per_page === 'number'
        ? filters.per_page.toString()
        : (filters.per_page ?? ''),
  };

  return (
    <AuthenticatedLayout
      header={<h1 className="text-lg font-semibold tracking-tight">Images</h1>}
    >
      <Head title="Images" />

      <div className="space-y-4 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <ImageHeader
            total={images.total}
            createRoute={route('images.create')}
          />

          <ImageFilters
            initialValues={initialFilterValues}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />

          {!hasItems && (
            <ImagesEmptyState createRoute={route('images.create')} />
          )}

          {hasItems && (
            <ImageList
              items={images.data}
              pagination={pagination}
              onItemClick={handleItemClick}
              onView={handleViewFromActions}
              onDelete={handleDeleteFromActions}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <ImagePreviewDialog
        open={previewOpen}
        image={selectedImage}
        onOpenChange={handlePreviewOpenChange}
      />
    </AuthenticatedLayout>
  );
}

function normalizePagination(images: ImagesIndexPagination<Image>): {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number | null;
  to: number | null;
} | null {
  if (
    images.current_page == null ||
    images.last_page == null ||
    images.total == null
  ) {
    return null;
  }

  return {
    currentPage: images.current_page,
    lastPage: images.last_page,
    total: images.total,
    from: images.from ?? null,
    to: images.to ?? null,
  };
}

function buildFilterQueryFromProps(filters: ImagesIndexFilters) {
  return {
    search: filters.search ?? '',
    usage: filters.usage ?? '',
    mime_type: filters.mime_type ?? '',
    storage_disk: filters.storage_disk ?? '',
    per_page:
      typeof filters.per_page === 'number'
        ? filters.per_page.toString()
        : (filters.per_page ?? ''),
  };
}
