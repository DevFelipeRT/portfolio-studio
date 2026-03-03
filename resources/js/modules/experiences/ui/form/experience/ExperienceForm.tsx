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
import {
  useExperiencesTranslation,
  EXPERIENCES_NAMESPACES,
} from '@/modules/experiences/i18n';

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
  const { translate: tSections } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.sections,
  );
  const { translate: tForm } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.form,
  );
  const summaryFields = getErrorSummaryFields(
    errors,
    tForm('fields.locale.label'),
  );

  return (
    <Form
      onSubmit={onSubmit}
      errors={errors}
      variant="spacious"
      errorSummaryFields={summaryFields}
    >
      <section className="space-y-4">
        <FormHeader
          title={
            <h2 className="text-lg font-medium">
              {tSections('details')}
            </h2>
          }
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
            label={tForm('fields.position.label')}
            required
            onChange={(value) => onChange('position', value)}
          />

          <TextInputField
            name="company"
            id="company"
            value={data.company}
            errors={errors}
            label={tForm('fields.company.label')}
            required
            onChange={(value) => onChange('company', value)}
          />
        </div>

        <TextareaField
          name="summary"
          id="summary"
          value={data.summary}
          errors={errors}
          label={tForm('fields.summary.label')}
          rows={3}
          onChange={(value) => onChange('summary', value)}
        />

        <RichTextField
          name="description"
          id="description"
          value={data.description}
          errors={errors}
          label={tForm('fields.description.label')}
          required
          onChange={(value) => onChange('description', value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TextInputField
            name="start_date"
            id="start_date"
            value={data.start_date}
            errors={errors}
            label={tForm('fields.start_date.label')}
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
            label={tForm('fields.end_date.label')}
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
          label={tForm('fields.display.label')}
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
