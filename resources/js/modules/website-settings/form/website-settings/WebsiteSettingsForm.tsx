import { Form, FormActions, type FormErrors } from '@/common/forms';
import {
  WEBSITE_SETTINGS_NAMESPACES,
  useWebsiteSettingsTranslation,
} from '@/modules/website-settings/i18n';
import React from 'react';

import { getErrorSummaryFields } from './errorSummaryFields';
import { IdentitySection } from './partials/IdentitySection';
import { InstitutionalLinksSection } from './partials/InstitutionalLinksSection';
import { LocalesSection } from './partials/LocalesSection';
import { ScopesSection } from './partials/ScopesSection';
import { SeoSection } from './partials/SeoSection';
import { SystemPagesSection } from './partials/SystemPagesSection';
import type { WebsiteSettingsFormProps } from './types';

export function WebsiteSettingsForm({
  data,
  errors,
  processing,
  onChange,
  onSubmit,
  cancelHref,
  locales,
}: WebsiteSettingsFormProps) {
  const { translate: tActions } = useWebsiteSettingsTranslation(
    WEBSITE_SETTINGS_NAMESPACES.actions,
  );
  const { translate: tForm } = useWebsiteSettingsTranslation(
    WEBSITE_SETTINGS_NAMESPACES.form,
  );
  const summaryFields = getErrorSummaryFields(errors, tForm);

  const handleLocaleMapChange = (
    field:
      | 'site_name'
      | 'site_description'
      | 'default_meta_title'
      | 'default_meta_description',
    locale: string,
    value: string,
  ) => {
    onChange(field, {
      ...data[field],
      [locale]: value,
    });
  };

  const localeCandidates = React.useMemo(() => {
    const set = new Set<string>();

    locales.forEach((locale) => {
      if (locale && locale !== 'auto') {
        set.add(locale);
      }
    });

    if (data.default_locale && data.default_locale !== 'auto') {
      set.add(data.default_locale);
    }

    if (data.fallback_locale && data.fallback_locale !== 'auto') {
      set.add(data.fallback_locale);
    }

    Object.keys(data.site_name).forEach((locale) => set.add(locale));
    Object.keys(data.site_description).forEach((locale) => set.add(locale));
    Object.keys(data.default_meta_title).forEach((locale) => set.add(locale));
    Object.keys(data.default_meta_description).forEach((locale) =>
      set.add(locale),
    );

    return Array.from(set).filter(Boolean);
  }, [
    locales,
    data.default_locale,
    data.fallback_locale,
    data.site_name,
    data.site_description,
    data.default_meta_title,
    data.default_meta_description,
  ]);

  const localizedFieldLocales =
    localeCandidates.length > 0
      ? localeCandidates
      : data.default_locale && data.default_locale !== 'auto'
        ? [data.default_locale]
        : [];

  return (
    <Form
      onSubmit={onSubmit}
      errors={errors as FormErrors}
      className="space-y-10"
      errorSummaryFields={summaryFields}
    >
      <IdentitySection
        data={data}
        errors={errors as FormErrors}
        locales={localizedFieldLocales}
        onLocaleMapChange={(field, locale, value) =>
          handleLocaleMapChange(field, locale, value)
        }
        onOwnerNameChange={(value) => onChange('owner_name', value)}
      />

      <LocalesSection
        errors={errors as FormErrors}
        defaultLocale={data.default_locale}
        fallbackLocale={data.fallback_locale}
        localeCandidates={localeCandidates}
        onDefaultLocaleChange={(value) => onChange('default_locale', value)}
        onFallbackLocaleChange={(value) => onChange('fallback_locale', value)}
      />

      <SeoSection
        data={data}
        errors={errors as FormErrors}
        locales={localizedFieldLocales}
        onLocaleMapChange={(field, locale, value) =>
          handleLocaleMapChange(field, locale, value)
        }
        onChange={onChange}
      />

      <ScopesSection
        errors={errors as FormErrors}
        publicEnabled={data.public_scope_enabled}
        privateEnabled={data.private_scope_enabled}
        onPublicEnabledChange={(value) =>
          onChange('public_scope_enabled', value)
        }
        onPrivateEnabledChange={(value) =>
          onChange('private_scope_enabled', value)
        }
      />

      <SystemPagesSection
        errors={errors as FormErrors}
        pages={data.system_pages}
        onChange={(pages) => onChange('system_pages', pages)}
      />

      <InstitutionalLinksSection
        errors={errors as FormErrors}
        links={data.institutional_links}
        onChange={(links) => onChange('institutional_links', links)}
      />

      <FormActions
        cancelHref={cancelHref}
        processing={processing}
        cancelLabel={tActions('cancel')}
        submitLabel={tActions('saveChanges')}
      />
    </Form>
  );
}
