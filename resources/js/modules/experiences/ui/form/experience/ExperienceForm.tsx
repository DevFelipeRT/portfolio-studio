import {
  Form,
  FormActions,
  FormHeader,
  type FormErrors,
} from '@/common/forms';
import {
  CheckboxField,
  RichTextField,
  TextareaField,
  TextInputField,
} from '@/common/forms';
import { useTranslation } from '@/common/i18n';

import { getErrorSummaryFields } from './errorSummaryFields';
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
    <Form
      onSubmit={onSubmit}
      errors={errors}
      variant="spacious"
      errorSummaryFields={summaryFields}
    >

      <section className="space-y-4">
        <FormHeader
          title={<h2 className="text-lg font-medium">Experience details</h2>}
          localeFieldProps={{
            value: data.locale,
            locales: supportedLocales,
            disabled: processing || localeDisabled,
            errorId: 'experience-locale-error',
            errors: errors as FormErrors<string>,
            onChange: (value) => {
              if (onLocaleChange) {
                onLocaleChange(value);
                return;
              }

              onChange('locale', value);
            },
          }}
        />

        {localeNote && (
          <p className="text-muted-foreground text-xs">{localeNote}</p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <TextInputField
            name="position"
            id="position"
            value={data.position}
            errors={errors}
            label="Position"
            required
            onChange={(value) => onChange('position', value)}
          />

          <TextInputField
            name="company"
            id="company"
            value={data.company}
            errors={errors}
            label="Company"
            required
            onChange={(value) => onChange('company', value)}
          />
        </div>

        <TextareaField
          name="summary"
          id="summary"
          value={data.summary}
          errors={errors}
          label="Summary"
          rows={3}
          onChange={(value) => onChange('summary', value)}
        />

        <RichTextField
          name="description"
          id="description"
          value={data.description}
          errors={errors}
          label="Description"
          required
          onChange={(value) => onChange('description', value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TextInputField
            name="start_date"
            id="start_date"
            value={data.start_date}
            errors={errors}
            label="Start date"
            required
            type="date"
            errorId="start-date-error"
            onChange={(value) => onChange('start_date', value)}
          />

          <TextInputField
            name="end_date"
            id="end_date"
            value={data.end_date}
            errors={errors}
            label="End date"
            type="date"
            errorId="end-date-error"
            onChange={(value) => onChange('end_date', value)}
          />
        </div>

        <CheckboxField
          name="display"
          id="display"
          value={data.display}
          errors={errors}
          label="Display on portfolio"
          className="pt-1"
          onChange={(value) => onChange('display', value)}
        />
      </section>

      <FormActions
        cancelHref={cancelHref}
        submitLabel={submitLabel}
        processing={processing}
      />
    </Form>
  );
}
