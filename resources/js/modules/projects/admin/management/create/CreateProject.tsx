import { FormActions, type FormErrors, useFormSubmit } from '@/common/forms';
import { useSupportedLocales } from '@/common/locale';
import { usePageForm, usePageProps } from '@/common/page-runtime';
import { ProjectForm } from '@/modules/projects/admin/management/_form';
import type {
  ProjectFormData,
  ProjectImageInput,
} from '@/modules/projects/admin/management/types';
import {
  PROJECTS_NAMESPACES,
  useProjectsTranslation,
} from '@/modules/projects/i18n';
import type { SkillCatalogItem } from '@/modules/skills/core/types';
import React from 'react';

export type CreateProjectProps = {
  skills: SkillCatalogItem[];
  status_values: string[];
};

const defaultProjectFormData: ProjectFormData = {
  locale: '',
  name: '',
  summary: '',
  description: '',
  status: '',
  repository_url: '',
  live_url: '',
  display: false,
  skill_ids: [],
  images: [],
};

export function CreateProject({
  skills,
  status_values,
}: CreateProjectProps) {
  const formId = 'project-create-form';
  const { translate: tActions } = useProjectsTranslation(PROJECTS_NAMESPACES.actions);
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const supportedLocales = useSupportedLocales();
  const submitForm = useFormSubmit();
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof ProjectFormData>;
  }>();
  const { data, setData, post, processing } = usePageForm<ProjectFormData>(
    'projects.create',
    defaultProjectFormData,
  );

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
    submitForm(event, post, route('projects.store'), { forceFormData: true });
  };

  return (
    <ProjectForm
      formId={formId}
      skills={skills}
      statusValues={status_values}
      existingImages={[]}
      data={data}
      errors={formErrors}
      processing={processing}
      supportedLocales={supportedLocales}
      onSubmit={handleSubmit}
      onChangeField={setField}
      onChangeSkillIds={handleChangeSkillIds}
      onAddImageRow={handleAddImageRow}
      onRemoveImageRow={handleRemoveImageRow}
      onUpdateImageAlt={handleUpdateImageAlt}
      onUpdateImageFile={handleUpdateImageFile}
    >
      <ProjectForm.Header>
        <div className="space-y-1.5">
          <h1 className="text-xl leading-tight font-semibold">
            {tActions('newProject')}
          </h1>
          <p className="text-muted-foreground text-sm leading-6">
            {tForm('help.createSubtitle')}
          </p>
        </div>
      </ProjectForm.Header>

      <ProjectForm.Footer>
        <FormActions
          cancelHref={route('projects.index')}
          submitLabel={tActions('saveProject')}
          processing={processing}
        />
      </ProjectForm.Footer>
    </ProjectForm>
  );
}
