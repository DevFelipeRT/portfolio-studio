// resources/js/Pages/Images/Create.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import type { ImageFormData } from '@/modules/images/core/forms';
import { IMAGES_NAMESPACES, useImagesTranslation } from '@/modules/images/i18n';
import { ImageForm } from '@/modules/images/ui/form/image';
import React from 'react';

/**
 * Page for creating a new image (upload + metadata).
 */
export default function Create() {
  const { translate: tActions } = useImagesTranslation(IMAGES_NAMESPACES.actions);
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
      <PageHead title={tActions('newImage')} />

      <PageContent className="overflow-hidden py-8" pageWidth="default">
        <div className="mb-6">
          <h1 className="text-xl leading-tight font-semibold">
            {tActions('newImage')}
          </h1>
        </div>

        <div className="mb-4">
          <PageLink
            href={route('images.index')}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            {tActions('backToIndex')}
          </PageLink>
        </div>

        <ImageForm
          mode="create"
          data={data}
          errors={formErrors}
          processing={processing}
          cancelHref={route('images.index')}
          cancelLabel={tActions('backToIndex')}
          submitLabel={tActions('saveImage')}
          onSubmit={handleSubmit}
          onChange={(field, value) => setData(field, value as never)}
        />
      </PageContent>
    </AuthenticatedLayout>
  );
}

Create.i18n = ['images'];
