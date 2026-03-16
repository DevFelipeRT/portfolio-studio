// resources/js/Pages/Images/Edit.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import type { FormErrors } from '@/common/forms';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import type { ImageFormData } from '@/modules/images/core/forms';
import type { Image } from '@/modules/images/core/types';
import { ImageForm } from '@/modules/images/ui/form/image';
import React from 'react';

interface EditImagePageProps {
  image: Image;
}

/**
 * Page for editing global metadata of an existing image.
 */
export default function Edit({ image }: EditImagePageProps) {
  const initial: ImageFormData = {
    file: null,
    alt_text: image.alt_text ?? '',
    image_title: image.image_title ?? '',
    caption: image.caption ?? '',
  };

  const { data, setData, put, processing, transform } = usePageForm<ImageFormData>(
    initial,
  );
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof ImageFormData>;
  }>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    transform((current) => {
      const payload = { ...current };
      delete (payload as Partial<ImageFormData>).file;
      return payload;
    });

    put(route('images.update', image.id), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AuthenticatedLayout>
      <PageHead title="Edit image" />

      <PageContent className="overflow-hidden py-8" pageWidth="default">
        <div className="mb-6">
          <h1 className="text-xl leading-tight font-semibold">Edit image</h1>
        </div>

        <div className="mb-4">
          <PageLink
            href={route('images.index')}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Back to images
          </PageLink>
        </div>

        <ImageForm
          mode="edit"
          image={image}
          data={data}
          errors={formErrors}
          processing={processing}
          cancelHref={route('images.index')}
          cancelLabel="Back to images"
          submitLabel="Update image metadata"
          onSubmit={handleSubmit}
          onChange={(field, value) => setData(field, value as never)}
        />
      </PageContent>
    </AuthenticatedLayout>
  );
}
