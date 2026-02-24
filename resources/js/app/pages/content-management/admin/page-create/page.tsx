import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import {
  PageForm,
  type PageFormData,
} from '@/modules/content-management/features/page-management/page/PageForm';
import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormDataValues } from '@inertiajs/core';
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
  const { data, setData, post, processing, reset } = useForm<PageFormData>(
    'admin.content.pages.create',
    defaultPageFormData,
  );
  const { errors: formErrors } = usePage().props as {
    errors: FormErrors<keyof PageFormData>;
  };
  const submitForm = useFormSubmit();

  const handleChange = <K extends keyof PageFormData>(
    field: K,
    value: PageFormData[K],
  ): void => {
    setData(field, value as FormDataValues<PageFormData, K>);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    submitForm(event, post, route('admin.content.pages.store'), {
      onSuccess: () => reset(),
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Create content page
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Define a new content-managed page before composing its sections.
          </p>
        </div>
      }
    >
      <Head title="Create page" />

      <div className="mx-auto max-w-4xl space-y-6">
        <PageForm
          mode="create"
          data={data}
          errors={formErrors}
          processing={processing}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </AuthenticatedLayout>
  );
}
