import { FormErrorSummary } from '@/common/forms';
import { useTranslation } from '@/common/i18n';

import { getErrorSummaryFields } from './errorSummaryFields';
import { ProjectFormActions } from './partials/ProjectFormActions';
import { DescriptionField } from './partials/fields/DescriptionField';
import { DisplayField } from './partials/fields/DisplayField';
import { LiveUrlField } from './partials/fields/LiveUrlField';
import { LocaleField } from './partials/fields/LocaleField';
import { NameField } from './partials/fields/NameField';
import { RepositoryUrlField } from './partials/fields/RepositoryUrlField';
import { StatusField } from './partials/fields/StatusField';
import { SummaryField } from './partials/fields/SummaryField';
import { ImagesSection } from './partials/sections/ImagesSection';
import { SkillsSection } from './partials/sections/SkillsSection';
import type { ProjectFormProps } from './types';

/**
 * Reusable project form partial used by both create and edit flows.
 */
export function ProjectForm({
  skills,
  existingImages,
  data,
  errors,
  processing,
  cancelHref,
  submitLabel,
  supportedLocales,
  localeDisabled = false,
  projectId,
  onSubmit,
  onChangeField,
  onChangeLocale,
  onChangeSkillIds,
  onAddImageRow,
  onRemoveImageRow,
  onUpdateImageAlt,
  onUpdateImageFile,
}: ProjectFormProps) {
  const { translate: t } = useTranslation('projects');
  const summaryFields = getErrorSummaryFields(errors, t);

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
          label={t('fields.locale.label')}
          placeholder={t('fields.locale.placeholder')}
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

          <StatusField
            value={data.status}
            errors={errors}
            onChange={(value) => onChangeField('status', value)}
          />
        </div>

        <SummaryField
          value={data.summary}
          errors={errors}
          onChange={(value) => onChangeField('summary', value)}
        />

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

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Links</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <RepositoryUrlField
            value={data.repository_url}
            errors={errors}
            onChange={(value) => onChangeField('repository_url', value)}
          />

          <LiveUrlField
            value={data.live_url}
            errors={errors}
            onChange={(value) => onChangeField('live_url', value)}
          />
        </div>
      </section>

      <SkillsSection
        skills={skills}
        selectedIds={data.skill_ids}
        errors={errors}
        onChangeSkillIds={onChangeSkillIds}
      />

      <ImagesSection
        projectId={projectId}
        existingImages={existingImages}
        images={data.images}
        errors={errors}
        onAddImageRow={onAddImageRow}
        onRemoveImageRow={onRemoveImageRow}
        onUpdateImageAlt={onUpdateImageAlt}
        onUpdateImageFile={onUpdateImageFile}
      />

      <ProjectFormActions
        processing={processing}
        submitLabel={submitLabel}
        cancelHref={cancelHref}
        deleteHref={projectId ? route('projects.destroy', projectId) : undefined}
      />
    </form>
  );
}
