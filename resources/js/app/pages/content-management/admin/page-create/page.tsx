import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import { PageHead, usePageForm, usePageProps } from '@/common/page-runtime';
import {
  PageForm,
  type PageFormData,
} from '@/modules/content-management/features/page-management/page/PageForm';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import React from 'react';

const defaultPageFormData: PageFormData = {
  slug: '',
  internal_name: '',
  title: '',
  meta_title: '',
  meta_description: '',
  layout_key: '',
  locale: '',
  is_published: false,
  is_indexable: true,
};

export default function PageCreate() {
  const { translate: tPages } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.pages,
  );
  const { data, setData, post, processing, reset } = usePageForm<PageFormData>(
    'admin.content.pages.create',
    defaultPageFormData,
  );
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof PageFormData>;
  }>();
  const submitForm = useFormSubmit();

  const handleChange = <K extends keyof PageFormData>(
    field: K,
    value: PageFormData[K],
  ): void => {
    setData(field, value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    submitForm(event, post, route('admin.content.pages.store'), {
      onSuccess: () => reset(),
    });
  };

  return (
    <AuthenticatedLayout>
      <PageHead title={tPages('create.headTitle', 'Create page')} />

      <PageContent pageWidth="editor" className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {tPages('create.title', 'Create content page')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {tPages(
              'create.description',
              'Define a new content-managed page before composing its sections.',
            )}
          </p>
        </div>

        <PageForm
          mode="create"
          data={data}
          errors={formErrors}
          processing={processing}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </PageContent>
    </AuthenticatedLayout>
  );
}

PageCreate.i18n = ['content-management'];
