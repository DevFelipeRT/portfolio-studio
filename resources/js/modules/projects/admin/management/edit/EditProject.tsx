import { FormActions, type FormErrors } from '@/common/forms';
import { useSupportedLocales } from '@/common/locale';
import { LocaleSwapDialog } from '@/common/LocaleSwapDialog';
import { usePageForm, usePageProps } from '@/common/page-runtime';
import { Button } from '@/components/ui/button';
import { ProjectForm } from '@/modules/projects/admin/management/_form';
import type {
  ProjectFormData,
  ProjectImageInput,
} from '@/modules/projects/admin/management/types';
import {
  useEditProjectLocaleConflict,
  ProjectTranslationOverlay,
  useTranslations,
} from '@/modules/projects/admin/project-translations';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { ProjectImage } from '@/modules/projects/types';
import React from 'react';
import type { EditProjectProps } from './types';

export function EditProject({
  project,
  skills,
  status_values,
  initial,
}: EditProjectProps) {
  const formId = `project-edit-${project.id}-form`;
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const { translate: tTranslations } = useProjectsTranslation(
    PROJECTS_NAMESPACES.translations,
  );
  const supportedLocales = useSupportedLocales();
  const existingImages: ProjectImage[] = project.images ?? [];
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof ProjectFormData>;
  }>();
  const { data, setData, post, processing, transform } =
    usePageForm<ProjectFormData>(initial);

  const setField = <K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K],
  ): void => {
    setData(key, value);
  };

  const handleChangeSkillIds = (ids: number[]): void => {
    setField('skill_ids', ids);
  };

  const handleAddImageRow = (): void => {
    setData((current: ProjectFormData) => ({
      ...current,
      images: [
        ...current.images,
        {
          file: null,
          alt: '',
        } as ProjectImageInput,
      ],
    }));
  };

  const handleRemoveImageRow = (index: number): void => {
    setData((current: ProjectFormData) => ({
      ...current,
      images: current.images.filter(
        (_image, imageIndex) => imageIndex !== index,
      ),
    }));
  };

  const handleUpdateImageAlt = (index: number, value: string): void => {
    setData((current: ProjectFormData) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index ? { ...image, alt: value } : image,
      ),
    }));
  };

  const handleUpdateImageFile = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0] ?? null;

    setData((current: ProjectFormData) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index ? { ...image, file } : image,
      ),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    transform((formData) => ({
      ...formData,
      _method: 'put',
    }));

    post(route('projects.update', project.id), {
      forceFormData: true,
      preserveState: true,
      preserveScroll: true,
    });
  };

  const localeConflict = useEditProjectLocaleConflict({
    projectId: project.id,
    currentLocale: data.locale,
    setLocale: (locale) => setField('locale', locale),
    setConfirmSwap: (value) => setField('confirm_swap', value),
  });

  const translationOverlay = useTranslations({
    projectId: project.id,
    projectLabel: project.name,
    baseLocale: data.locale,
  });

  return (
    <>
      <ProjectForm
        formId={formId}
        skills={skills}
        statusValues={status_values}
        existingImages={existingImages}
        projectId={project.id}
        data={data}
        errors={formErrors}
      processing={processing}
      supportedLocales={supportedLocales}
      localeDisabled={localeConflict.localeDisabled}
      localeNote={localeConflict.localeNote}
      onSubmit={handleSubmit}
      onChangeField={setField}
      onChangeLocale={localeConflict.handleLocaleChange}
      onChangeSkillIds={handleChangeSkillIds}
      onAddImageRow={handleAddImageRow}
      onRemoveImageRow={handleRemoveImageRow}
      onUpdateImageAlt={handleUpdateImageAlt}
      onUpdateImageFile={handleUpdateImageFile}
    >
      <ProjectForm.Header>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <h1 className="text-xl leading-tight font-semibold">
              {tActions('editProjectTitle', { name: project.name })}
            </h1>
            <p className="text-muted-foreground text-sm leading-6">
              {tForm('help.editSubtitle')}
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={translationOverlay.openTranslations}
          >
            {tTranslations('manage')}
          </Button>
        </div>
      </ProjectForm.Header>

      <ProjectForm.Footer>
        <FormActions
          cancelHref={route('projects.index')}
          submitLabel={tActions('saveProject')}
          processing={processing}
          deleteHref={route('projects.destroy', project.id)}
          showDeleteWhen="always"
        />
      </ProjectForm.Footer>
      </ProjectForm>

      <ProjectTranslationOverlay {...translationOverlay.overlayProps} />

      {localeConflict.pendingLocale !== null ? (
        <LocaleSwapDialog
          open={localeConflict.swapDialogOpen}
          currentLocale={data.locale}
          nextLocale={localeConflict.pendingLocale}
          onConfirmSwap={localeConflict.handleConfirmSwap}
          onConfirmNoSwap={localeConflict.handleConfirmNoSwap}
          onCancel={localeConflict.handleCancelSwap}
        />
      ) : null}
    </>
  );
}
