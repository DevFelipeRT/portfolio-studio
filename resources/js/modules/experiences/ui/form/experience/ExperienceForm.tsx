import { FormErrorSummary } from '@/common/forms';
import { useTranslation } from '@/common/i18n';

import { getErrorSummaryFields } from './errorSummaryFields';
import { ExperienceFormActions } from './partials/ExperienceFormActions';
import { CompanyField } from './partials/fields/CompanyField';
import { DescriptionField } from './partials/fields/DescriptionField';
import { DisplayField } from './partials/fields/DisplayField';
import { EndDateField } from './partials/fields/EndDateField';
import { LocaleField } from './partials/fields/LocaleField';
import { PositionField } from './partials/fields/PositionField';
import { StartDateField } from './partials/fields/StartDateField';
import { SummaryField } from './partials/fields/SummaryField';
import type { ExperienceFormProps } from './types';

/**
 * Renders the reusable experience form for create and edit flows.
 */
export function ExperienceForm({
  data,
  errors,
  processing,
  supportedLocales,
  cancelHref,
  submitLabel,
  localeDisabled = false,
  localeNote = null,
  onSubmit,
  onChange,
  onLocaleChange,
}: ExperienceFormProps) {
  const { translate: t } = useTranslation('experience');
  const summaryFields = getErrorSummaryFields(errors, t('fields.locale.label'));

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
    >
      <FormErrorSummary fields={summaryFields} />

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Experience details</h2>

        <LocaleField
          value={data.locale}
          errors={errors}
          processing={processing}
          supportedLocales={supportedLocales}
          label={t('fields.locale.label')}
          placeholder={t('fields.locale.placeholder')}
          localeDisabled={localeDisabled}
          onChange={(value) => {
            if (onLocaleChange) {
              onLocaleChange(value);
              return;
            }

            onChange('locale', value);
          }}
        />

        {localeNote && <p className="text-muted-foreground text-xs">{localeNote}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <PositionField
            value={data.position}
            errors={errors}
            onChange={(value) => onChange('position', value)}
          />

          <CompanyField
            value={data.company}
            errors={errors}
            onChange={(value) => onChange('company', value)}
          />
        </div>

        <SummaryField
          value={data.summary}
          errors={errors}
          onChange={(value) => onChange('summary', value)}
        />

        <DescriptionField
          value={data.description}
          errors={errors}
          onChange={(value) => onChange('description', value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <StartDateField
            value={data.start_date}
            errors={errors}
            onChange={(value) => onChange('start_date', value)}
          />

          <EndDateField
            value={data.end_date}
            errors={errors}
            onChange={(value) => onChange('end_date', value)}
          />
        </div>

        <DisplayField
          value={data.display}
          errors={errors}
          onChange={(value) => onChange('display', value)}
        />
      </section>

      <ExperienceFormActions
        cancelHref={cancelHref}
        submitLabel={submitLabel}
        processing={processing}
      />
    </form>
  );
}

