import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import { useSupportedLocales } from '@/common/locale';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import type {
  ImageInput,
  ProjectFormData,
} from '@/modules/projects/core/forms';
import { useProjectsTranslation } from '@/modules/projects/i18n';
import { PROJECTS_NAMESPACES } from '@/modules/projects/i18n';
import { ProjectForm } from '@/modules/projects/ui/form/project';
import type { Skill } from '@/modules/skills/core/types';
import React from 'react';

interface CreateProjectProps {
  skills: Skill[];
}

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

export default function Create({ skills }: CreateProjectProps) {
  const supportedLocales = useSupportedLocales();
  const { data, setData, post, processing } = usePageForm<ProjectFormData>(
    'projects.create',
    defaultProjectFormData,
  );
  const submitForm = useFormSubmit();
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof ProjectFormData>;
  }>();

  function changeField<K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K],
  ): void {
    setData((current: ProjectFormData) => ({
      ...current,
      [key]: value,
    }));
  }

  function changeSkillIds(ids: number[]): void {
    changeField('skill_ids', ids);
  }

  function addImageRow(): void {
    setData((current: ProjectFormData) => ({
      ...current,
      images: [
        ...current.images,
        {
          file: null,
          alt: '',
        } as ImageInput,
      ],
    }));
  }

  function removeImageRow(index: number): void {
    setData((current: ProjectFormData) => ({
      ...current,
      images: current.images.filter((_image, i) => i !== index),
    }));
  }

  function updateImageAlt(index: number, value: string): void {
    setData((current: ProjectFormData) => ({
      ...current,
      images: current.images.map((image, i) =>
        i === index ? { ...image, alt: value } : image,
      ),
    }));
  }

  function updateImageFile(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    const file = event.target.files?.[0] ?? null;

    setData((current: ProjectFormData) => ({
      ...current,
      images: current.images.map((image, i) =>
        i === index ? { ...image, file } : image,
      ),
    }));
  }

  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    submitForm(event, post, route('projects.store'), { forceFormData: true });
  };

  return (
    <>
      <PageHead title="New project" />

      <CreateProjectContent
        skills={skills}
        supportedLocales={supportedLocales}
        data={data}
        formErrors={formErrors}
        processing={processing}
        onSubmit={submit}
        onChangeField={changeField}
        onChangeSkillIds={changeSkillIds}
        onAddImageRow={addImageRow}
        onRemoveImageRow={removeImageRow}
        onUpdateImageAlt={updateImageAlt}
        onUpdateImageFile={updateImageFile}
      />
    </>
  );
}

Create.i18n = ['projects'];
Create.layout = (page: React.ReactNode) => (
  <AuthenticatedLayout>{page}</AuthenticatedLayout>
);

function CreateProjectHeader() {
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );
  return (
    <h1 className="text-xl leading-tight font-semibold">
      {tActions('newProject')}
    </h1>
  );
}

type CreateProjectContentProps = {
  skills: Skill[];
  supportedLocales: readonly string[];
  data: ProjectFormData;
  formErrors: FormErrors<keyof ProjectFormData>;
  processing: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChangeField: <K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K],
  ) => void;
  onChangeSkillIds: (ids: number[]) => void;
  onAddImageRow: () => void;
  onRemoveImageRow: (index: number) => void;
  onUpdateImageAlt: (index: number, value: string) => void;
  onUpdateImageFile: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

function CreateProjectContent({
  skills,
  supportedLocales,
  data,
  formErrors,
  processing,
  onSubmit,
  onChangeField,
  onChangeSkillIds,
  onAddImageRow,
  onRemoveImageRow,
  onUpdateImageAlt,
  onUpdateImageFile,
}: CreateProjectContentProps) {
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );

  return (
    <PageContent className="overflow-hidden py-8" pageWidth="default">
      <div className="mb-6">
        <CreateProjectHeader />
      </div>

      <div className="mb-4">
        <PageLink
          href={route('projects.index')}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          {tActions('backToIndex')}
        </PageLink>
      </div>

      <ProjectForm
        skills={skills}
        existingImages={[]}
        projectId={undefined}
        data={data}
        errors={formErrors}
        processing={processing}
        cancelHref={route('projects.index')}
        submitLabel={tActions('saveProject')}
        supportedLocales={supportedLocales}
        onSubmit={onSubmit}
        onChangeField={onChangeField}
        onChangeSkillIds={onChangeSkillIds}
        onAddImageRow={onAddImageRow}
        onRemoveImageRow={onRemoveImageRow}
        onUpdateImageAlt={onUpdateImageAlt}
        onUpdateImageFile={onUpdateImageFile}
      />
    </PageContent>
  );
}
