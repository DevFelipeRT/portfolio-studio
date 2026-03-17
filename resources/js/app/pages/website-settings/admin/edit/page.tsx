import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import { PageHead, usePageForm, usePageProps } from '@/common/page-runtime';
import {
  WEBSITE_SETTINGS_NAMESPACES,
  useWebsiteSettingsTranslation,
} from '@/modules/website-settings/i18n';
import type { WebsiteSettingsPageProps } from '@/modules/website-settings/types';
import { WebsiteSettingsForm } from '@/modules/website-settings/form/website-settings';
import {
  buildWebsiteSettingsFormData,
  syncLocaleMaps,
  type WebsiteSettingsFormData,
} from '@/modules/website-settings/forms';
import React from 'react';

export default function Edit({ settings, locales }: WebsiteSettingsPageProps) {
  const { translate: tActions } = useWebsiteSettingsTranslation(
    WEBSITE_SETTINGS_NAMESPACES.actions,
  );
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
    <AuthenticatedLayout>
      <PageHead title={tActions('pageTitle')} />

      <PageContent className="overflow-hidden py-8" pageWidth="default">
        <div className="mb-6">
          <h1 className="text-xl leading-tight font-semibold">{tActions('pageTitle')}</h1>
        </div>

        <WebsiteSettingsForm
          data={data}
          errors={formErrors}
          processing={processing}
          onChange={handleChange}
          onSubmit={handleSubmit}
          cancelHref={route('dashboard')}
          locales={locales}
        />
      </PageContent>
    </AuthenticatedLayout>
  );
}

Edit.i18n = ['website-settings'];
