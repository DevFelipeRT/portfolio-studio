import {
  Form,
  FormActions,
  FormHeader,
  type FormErrors,
} from '@/common/forms';
import {
  CheckboxField,
  DatePickerField,
  RichTextField,
  TextareaField,
  TextInputField,
} from '@/common/forms';

import { getErrorSummaryFields } from './errorSummaryFields';
import { ImagesSection } from './partials/ImagesSection';
import type { InitiativeFormProps } from './types';

/**
 * Shared form for creating and editing initiatives.
 */
export function InitiativeForm({
  submitLabel,
  cancelHref,
  initiativeId,
  existingImages,
  data,
  errors,
  processing,
  supportedLocales,
  localeDisabled = false,
  onSubmit,
  onChangeField,
  onChangeLocale,
  onAddImageRow,
  onRemoveImageRow,
  onUpdateImageAlt,
  onUpdateImageFile,
}: InitiativeFormProps) {
  const summaryFields = getErrorSummaryFields(errors);

  return (
    <Form
      onSubmit={onSubmit}
      errors={errors}
      variant="spacious"
      errorSummaryFields={summaryFields}
    >

      <section className="space-y-4">
        <FormHeader
          title={<h2 className="text-lg font-medium">Basic information</h2>}
          localeFieldProps={{
            value: data.locale,
            locales: supportedLocales,
            disabled: processing || localeDisabled,
            errorId: 'initiative-locale-error',
            errors: errors as FormErrors<string>,
            onChange: (value) => {
              if (onChangeLocale) {
                onChangeLocale(value);
                return;
              }
              onChangeField('locale', value);
            },
          }}
        />

        <div className="grid gap-4 md:grid-cols-4">
          <TextInputField
            name="name"
            id="name"
            value={data.name}
            errors={errors}
            label="Name"
            required
            onChange={(value) => onChangeField('name', value)}
            className="col-span-2"
          />

          <DatePickerField
            name="start_date"
            id="start_date"
            value={data.start_date}
            errors={errors}
            label="Start date"
            required
            placeholder="Select a date"
            errorId="start-date-error"
            onChange={(value) => onChangeField('start_date', value)}
          />

          <DatePickerField
            name="end_date"
            id="end_date"
            value={data.end_date}
            errors={errors}
            label="End date"
            placeholder="Select a date"
            errorId="end-date-error"
            onChange={(value) => onChangeField('end_date', value)}
          />
        </div>

        <TextareaField
          name="summary"
          id="summary"
          value={data.summary}
          errors={errors}
          label="Summary"
          required
          rows={3}
          onChange={(value) => onChangeField('summary', value)}
        />

        <RichTextField
          name="description"
          id="description"
          value={data.description}
          errors={errors}
          label="Description"
          required
          onChange={(value) => onChangeField('description', value)}
        />

        <CheckboxField
          name="display"
          id="display"
          value={data.display}
          errors={errors}
          label="Display on landing"
          onChange={(value) => onChangeField('display', value)}
        />
      </section>

      <ImagesSection
        initiativeId={initiativeId}
        existingImages={existingImages}
        images={data.images}
        errors={errors}
        onAddImageRow={onAddImageRow}
        onRemoveImageRow={onRemoveImageRow}
        onUpdateImageAlt={onUpdateImageAlt}
        onUpdateImageFile={onUpdateImageFile}
      />

      <FormActions
        cancelHref={cancelHref}
        submitLabel={submitLabel}
        processing={processing}
      />
    </Form>
  );
}
