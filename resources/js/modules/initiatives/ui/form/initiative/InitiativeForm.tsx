import { FormErrorSummary } from '@/common/forms';

import { getErrorSummaryFields } from './errorSummaryFields';
import { InitiativeFormActions } from './partials/InitiativeFormActions';
import { DescriptionField } from './partials/fields/DescriptionField';
import { DisplayField } from './partials/fields/DisplayField';
import { EndDateField } from './partials/fields/EndDateField';
import { LocaleField } from './partials/fields/LocaleField';
import { NameField } from './partials/fields/NameField';
import { StartDateField } from './partials/fields/StartDateField';
import { SummaryField } from './partials/fields/SummaryField';
import { ExistingImagesSection } from './partials/sections/ExistingImagesSection';
import { ImagesSection } from './partials/sections/ImagesSection';
import type { InitiativeFormProps } from './types';

/**
 * Shared form for creating and editing initiatives.
 */
export function InitiativeForm({
  submitLabel,
  cancelHref,
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
    <form
      onSubmit={onSubmit}
      className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
    >
      <FormErrorSummary fields={summaryFields} />

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Basic information</h2>

        <LocaleField
          value={data.locale}
          errors={errors}
          processing={processing}
          supportedLocales={supportedLocales}
          localeDisabled={localeDisabled}
          onChange={(value) => {
            if (onChangeLocale) {
              onChangeLocale(value);
              return;
            }
            onChangeField('locale', value);
          }}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <NameField
            value={data.name}
            errors={errors}
            onChange={(value) => onChangeField('name', value)}
          />

          <StartDateField
            value={data.start_date}
            errors={errors}
            onChange={(value) => onChangeField('start_date', value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SummaryField
            value={data.summary}
            errors={errors}
            onChange={(value) => onChangeField('summary', value)}
          />

          <EndDateField
            value={data.end_date}
            errors={errors}
            onChange={(value) => onChangeField('end_date', value)}
          />
        </div>

        <DescriptionField
          value={data.description}
          errors={errors}
          onChange={(value) => onChangeField('description', value)}
        />

        <DisplayField
          value={data.display}
          errors={errors}
          onChange={(value) => onChangeField('display', value)}
        />
      </section>

      <ExistingImagesSection images={existingImages} />

      <ImagesSection
        images={data.images}
        errors={errors}
        onAddImageRow={onAddImageRow}
        onRemoveImageRow={onRemoveImageRow}
        onUpdateImageAlt={onUpdateImageAlt}
        onUpdateImageFile={onUpdateImageFile}
      />

      <InitiativeFormActions
        cancelHref={cancelHref}
        processing={processing}
        submitLabel={submitLabel}
      />
    </form>
  );
}

