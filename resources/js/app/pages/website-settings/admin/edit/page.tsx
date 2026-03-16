import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import { PageHead, usePageForm, usePageProps } from '@/common/page-runtime';
import type { WebsiteSettingsPageProps } from '@/modules/website-settings/types';
import { WebsiteSettingsForm } from '@/modules/website-settings/form/website-settings';
import {
  buildWebsiteSettingsFormData,
  syncLocaleMaps,
  type WebsiteSettingsFormData,
} from '@/modules/website-settings/forms';
import React from 'react';

export default function Edit({ settings, locales }: WebsiteSettingsPageProps) {
  const initialData = React.useMemo(
    () => buildWebsiteSettingsFormData(settings, locales),
    [settings, locales],
  );

  const { data, setData, put, processing, setDefaults } =
    usePageForm<WebsiteSettingsFormData>(initialData);
  const submitForm = useFormSubmit();
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors;
  }>();

  const handleChange = (
    field: keyof WebsiteSettingsFormData,
    value: unknown,
  ): void => {
    const next = syncLocaleMaps(
      {
        ...(data as WebsiteSettingsFormData),
        [field]: value as never,
      },
      locales,
    );
    setData(next);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    submitForm(event, put, route('website-settings.update'), {
      onSuccess: () => setDefaults(),
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h1 className="text-xl leading-tight font-semibold">
          Website settings
        </h1>
      }
    >
      <PageHead title="Website settings" />

      <div className="overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <WebsiteSettingsForm
            data={data}
            errors={formErrors}
            processing={processing}
            onChange={handleChange}
            onSubmit={handleSubmit}
            cancelHref={route('dashboard')}
            locales={locales}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
