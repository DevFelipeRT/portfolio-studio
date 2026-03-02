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
import { useProjectsTranslation, PROJECTS_NAMESPACES } from '@/modules/projects/i18n';

import { getErrorSummaryFields } from './errorSummaryFields';
import { ImagesSection } from './partials/ImagesSection';
import { SkillsSection } from './partials/SkillsSection';
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
  const { translate: tSections } = useProjectsTranslation(
    PROJECTS_NAMESPACES.sections,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const summaryFields = getErrorSummaryFields(errors, tForm);

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
              {tSections('basicInformation')}
            </h2>
          }
          localeFieldProps={{
            value: data.locale,
            locales: supportedLocales,
            disabled: processing || localeDisabled,
            errorId: 'project-locale-error',
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

        <div className="grid gap-4 md:grid-cols-2">
          <TextInputField
            name="name"
            id="name"
            value={data.name}
            errors={errors}
            label={tForm('fields.name.label')}
            required
            onChange={(value) => onChangeField('name', value)}
          />

          <TextInputField
            name="status"
            id="status"
            value={data.status}
            errors={errors}
            label={tForm('fields.status.label')}
            required
            placeholder={tForm('fields.status.placeholder')}
            onChange={(value) => onChangeField('status', value)}
          />
        </div>

        <TextareaField
          name="summary"
          id="summary"
          value={data.summary}
          errors={errors}
          label={tForm('fields.summary.label')}
          required
          rows={3}
          onChange={(value) => onChangeField('summary', value)}
        />

        <RichTextField
          name="description"
          id="description"
          value={data.description}
          errors={errors}
          label={tForm('fields.description.label')}
          required
          onChange={(value) => onChangeField('description', value)}
        />

        <CheckboxField
          name="display"
          id="display"
          value={data.display}
          errors={errors}
          label={tForm('fields.display.label')}
          onChange={(value) => onChangeField('display', value)}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">{tSections('links')}</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <TextInputField
            name="repository_url"
            id="repository_url"
            value={data.repository_url}
            errors={errors}
            label={tForm('fields.repository_url.label')}
            onChange={(value) => onChangeField('repository_url', value)}
          />

          <TextInputField
            name="live_url"
            id="live_url"
            value={data.live_url}
            errors={errors}
            label={tForm('fields.live_url.label')}
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

      <FormActions
        cancelHref={cancelHref}
        submitLabel={submitLabel}
        processing={processing}
        deleteHref={projectId ? route('projects.destroy', projectId) : undefined}
        showDeleteWhen="always"
      />
    </Form>
  );
}
