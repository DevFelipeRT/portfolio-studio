// resources/js/Pages/Images/Index.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead, pageRouter } from '@/common/page-runtime';
import { useState } from 'react';

import type { Image } from '@/modules/images/core/types';
import {
  IMAGES_NAMESPACES,
  useImagesTranslation,
} from '@/modules/images/i18n';
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
  const { translate: tImages } = useImagesTranslation(IMAGES_NAMESPACES.images);
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
      tImages('confirm.delete'),
    );

    if (!confirmed) {
      return;
    }

    pageRouter.delete(route('images.destroy', image.id), {
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

    pageRouter.get(route('images.index'), payload, {
      preserveScroll: true,
      preserveState: true,
      replace: true,
    });
  };

  const handleResetFilters = () => {
    pageRouter.get(
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
    pageRouter.get(
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
    <AuthenticatedLayout>
      <PageHead title={tImages('page.title')} />

      <PageContent
        className="space-y-4 overflow-hidden py-6"
        pageWidth="wide"
      >
        <ImageHeader total={images.total} createRoute={route('images.create')} />

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
      </PageContent>

      <ImagePreviewDialog
        open={previewOpen}
        image={selectedImage}
        onOpenChange={handlePreviewOpenChange}
      />
    </AuthenticatedLayout>
  );
}

Index.i18n = ['images'];

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
