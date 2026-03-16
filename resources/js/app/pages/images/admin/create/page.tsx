// resources/js/Pages/Images/Create.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import type { ImageFormData } from '@/modules/images/core/forms';
import { ImageForm } from '@/modules/images/ui/form/image';
import React from 'react';

/**
 * Page for creating a new image (upload + metadata).
 */
export default function Create() {
  const defaultValues: ImageFormData = {
    file: null,
    alt_text: '',
    image_title: '',
    caption: '',
  };

  const { data, setData, post, processing } = usePageForm<ImageFormData>(
    'images.create',
    defaultValues,
  );
  const submitForm = useFormSubmit();
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof ImageFormData>;
  }>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    submitForm(event, post, route('images.store'), { forceFormData: true });
  };

  return (
    <AuthenticatedLayout>
      <PageHead title="New image" />

      <div className="overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4">
            <PageLink
              href={route('images.index')}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Back to images
            </PageLink>
          </div>

          <ImageForm
            mode="create"
            data={data}
            errors={formErrors}
            processing={processing}
            cancelHref={route('images.index')}
            cancelLabel="Back to images"
            submitLabel="Save image"
            onSubmit={handleSubmit}
            onChange={(field, value) => setData(field, value as never)}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
