'use client';

import { FormErrorSummary } from '@/common/forms';
import { useSupportedLocales, useTranslation } from '@/common/i18n';
import type { CourseFormData } from '@/modules/courses/core/forms';

import { getErrorSummaryFields } from './errorSummaryFields';
import { CourseFormActions } from './partials/CourseFormActions';
import { CategoryField } from './partials/fields/CategoryField';
import { CompletedAtField } from './partials/fields/CompletedAtField';
import { DescriptionField } from './partials/fields/DescriptionField';
import { DisplayField } from './partials/fields/DisplayField';
import { InstitutionField } from './partials/fields/InstitutionField';
import { LocaleField } from './partials/fields/LocaleField';
import { NameField } from './partials/fields/NameField';
import { StartedAtField } from './partials/fields/StartedAtField';
import { SummaryField } from './partials/fields/SummaryField';
import type { CourseFormProps } from './types';

/**
 * CourseForm component. All user-facing strings are provided by the i18n hook.
 * The component expects date values in ISO format (yyyy-MM-dd) or null.
 */
export function CourseForm({
  data,
  errors,
  processing,
  categories,
  onChange,
  onSubmit,
  cancelHref,
  onLocaleChange,
  localeDisabled = false,
}: CourseFormProps) {
  const { translate: t, locale } = useTranslation('courses');
  const supportedLocales = useSupportedLocales();

  const summaryFields = getErrorSummaryFields(errors, t);

  const handleLocaleValueChange = (value: CourseFormData['locale']): void => {
    if (onLocaleChange) {
      onLocaleChange(value);
      return;
    }
    onChange('locale', value);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
    >
      <FormErrorSummary fields={summaryFields} />

      <section className="space-y-4">
        <h2 className="text-lg font-medium">{t('sections.details')}</h2>

        <LocaleField
          value={data.locale}
          errors={errors}
          processing={processing}
          disabled={localeDisabled}
          label={t('fields.locale.label')}
          placeholder={t('fields.locale.placeholder')}
          supportedLocales={supportedLocales}
          onChange={handleLocaleValueChange}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <NameField
            value={data.name}
            errors={errors}
            processing={processing}
            label={t('fields.name.label')}
            placeholder={t('fields.name.placeholder')}
            onChange={(value) => onChange('name', value)}
          />

          <InstitutionField
            value={data.institution}
            errors={errors}
            processing={processing}
            label={t('fields.institution.label')}
            placeholder={t('fields.institution.placeholder')}
            onChange={(value) => onChange('institution', value)}
          />

          <CategoryField
            value={data.category}
            errors={errors}
            processing={processing}
            label={t('fields.category.label')}
            placeholder={t('fields.category.placeholder')}
            categories={categories}
            onChange={(value) => onChange('category', value)}
          />
        </div>

        <SummaryField
          value={data.summary}
          errors={errors}
          processing={processing}
          label={t('fields.summary.label')}
          placeholder={t('fields.summary.placeholder')}
          onChange={(value) => onChange('summary', value)}
        />

        <DescriptionField
          value={data.description}
          errors={errors}
          label={t('fields.description.label')}
          onChange={(value) => onChange('description', value)}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">{t('sections.timeline')}</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <StartedAtField
            value={data.started_at}
            errors={errors}
            processing={processing}
            locale={locale}
            supportedLocales={supportedLocales}
            label={t('fields.started_at.label')}
            onChange={(value) => onChange('started_at', value)}
          />

          <CompletedAtField
            value={data.completed_at}
            errors={errors}
            processing={processing}
            locale={locale}
            supportedLocales={supportedLocales}
            label={t('fields.completed_at.label')}
            onChange={(value) => onChange('completed_at', value)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">{t('sections.visibility')}</h2>

        <DisplayField
          value={data.display}
          errors={errors}
          processing={processing}
          label={t('fields.display.label')}
          onChange={(value) => onChange('display', value)}
        />
      </section>

      <CourseFormActions
        cancelHref={cancelHref}
        processing={processing}
        cancelLabel={t('actions.cancel')}
        saveLabel={t('actions.save')}
        savingLabel={t('actions.saving')}
      />
    </form>
  );
}

