'use client';

import {
  CheckboxField,
  DatePickerField,
  Form,
  FormActions,
  FormHeader,
  RichTextField,
  SelectField,
  TextareaField,
  TextInputField,
  type FormErrors,
} from '@/common/forms';
import { useSupportedLocales } from '@/common/locale';
import type { CourseFormData } from '@/modules/courses/core/forms';
import { useCoursesTranslation, COURSES_NAMESPACES } from '@/modules/courses/i18n';
import { getErrorSummaryFields } from './errorSummaryFields';

export interface CourseFormProps {
  data: CourseFormData;
  errors: FormErrors<keyof CourseFormData>;
  processing: boolean;
  categories: Record<string, string>;
  onChange(key: keyof CourseFormData, value: string | null | boolean): void;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  cancelHref: string;
  onLocaleChange?(locale: string): void;
  localeDisabled?: boolean;
}

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
  const { translate: tSections } = useCoursesTranslation(
    COURSES_NAMESPACES.sections,
  );
  const { translate: tForm, locale } = useCoursesTranslation(
    COURSES_NAMESPACES.form,
  );
  const { translate: tActions } = useCoursesTranslation(
    COURSES_NAMESPACES.actions,
  );
  const supportedLocales = useSupportedLocales();

  const summaryFields = getErrorSummaryFields(errors, tForm);

  const handleLocaleValueChange = (value: CourseFormData['locale']): void => {
    if (onLocaleChange) {
      onLocaleChange(value);
      return;
    }
    onChange('locale', value);
  };

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
            <h2 className="text-lg font-medium">{tSections('details')}</h2>
          }
          localeFieldProps={{
            value: data.locale,
            locales: supportedLocales,
            disabled: processing || localeDisabled,
            errorId: 'course-locale-error',
            errors: errors as FormErrors<string>,
            onChange: handleLocaleValueChange,
          }}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TextInputField
            name="name"
            id="name"
            value={data.name}
            errors={errors}
            label={tForm('fields.name.label')}
            placeholder={tForm('fields.name.placeholder')}
            disabled={processing}
            required
            className="md:col-span-2"
            onChange={(value) => onChange('name', value)}
          />

          <TextInputField
            name="institution"
            id="institution"
            value={data.institution}
            errors={errors}
            label={tForm('fields.institution.label')}
            placeholder={tForm('fields.institution.placeholder')}
            disabled={processing}
            onChange={(value) => onChange('institution', value)}
          />

          <SelectField
            name="category"
            id="category"
            value={data.category}
            errors={errors}
            label={tForm('fields.category.label')}
            placeholder={tForm('fields.category.placeholder')}
            disabled={processing}
            required
            options={Object.entries(categories).map(([id, categoryLabel]) => ({
              value: id,
              label: categoryLabel,
            }))}
            onChange={(value) => onChange('category', value)}
          />
        </div>

        <TextareaField
          name="summary"
          id="summary"
          value={data.summary}
          errors={errors}
          label={tForm('fields.summary.label')}
          placeholder={tForm('fields.summary.placeholder')}
          disabled={processing}
          required
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
          disabled={processing}
          onChange={(value) => onChange('description', value)}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">{tSections('timeline')}</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <DatePickerField
            name="started_at"
            id="started_at"
            value={data.started_at}
            errors={errors}
            label={tForm('fields.started_at.label')}
            required
            disabled={processing}
            remountKey={locale}
            locale={locale}
            supportedLocales={supportedLocales}
            onChange={(value) => onChange('started_at', value)}
          />

          <DatePickerField
            name="completed_at"
            id="completed_at"
            value={data.completed_at}
            errors={errors}
            label={tForm('fields.completed_at.label')}
            disabled={processing}
            remountKey={locale}
            locale={locale}
            supportedLocales={supportedLocales}
            onChange={(value) => onChange('completed_at', value)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">{tSections('visibility')}</h2>

      <CheckboxField
          name="display"
          id="display"
          value={data.display}
          errors={errors}
          label={tForm('fields.display.label')}
          disabled={processing}
          onChange={(value) => onChange('display', value)}
        />
      </section>

      <FormActions
        cancelHref={cancelHref}
        cancelLabel={tActions('cancel')}
        submitLabel={tActions('save')}
        processing={processing}
        cancelVariant="ghostButton"
        disableCancelWhenProcessing
        submittingLabel={tActions('saving')}
        showSpinnerWhenProcessing
      />
    </Form>
  );
}
