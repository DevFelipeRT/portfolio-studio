import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import type { FormErrors } from '@/common/forms';
import {
  PageForm,
  type PageFormData,
} from '@/modules/content-management/features/page-management/page/PageForm';
import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormDataValues } from '@inertiajs/core';
import React from 'react';

export default function PageCreate() {
  const { data, setData, post, processing } = useForm<PageFormData>({
    slug: '',
    internal_name: '',
    title: '',
    meta_title: '',
    meta_description: '',
    layout_key: '',
    locale: '',
    is_published: false,
    is_indexable: true,
  });
  const { errors: formErrors } = usePage().props as {
    errors: FormErrors<keyof PageFormData>;
  };

  const handleChange = <K extends keyof PageFormData>(
    field: K,
    value: PageFormData[K],
  ): void => {
    setData(field, value as FormDataValues<PageFormData, K>);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    post(route('admin.content.pages.store'), {
      preserveState: true,
      preserveScroll: true,
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
