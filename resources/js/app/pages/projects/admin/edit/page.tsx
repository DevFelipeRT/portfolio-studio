import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import type { FormErrors } from '@/common/forms';
import { useSupportedLocales } from '@/common/locale';
import { LocaleSwapDialog } from '@/common/LocaleSwapDialog';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import { Button } from '@/components/ui/button';
import { listProjectTranslations } from '@/modules/projects/core/api/translations';
import type {
  ImageInput,
  ProjectFormData,
} from '@/modules/projects/core/forms';
import type { Project, ProjectImage } from '@/modules/projects/core/types';
import { useProjectsTranslation } from '@/modules/projects/i18n';
import { PROJECTS_NAMESPACES } from '@/modules/projects/i18n';
import { ProjectForm } from '@/modules/projects/ui/form/project';
import { TranslationModal } from '@/modules/projects/ui/TranslationModal';
import type { SkillCatalogItem } from '@/modules/skills/core/types';
import React from 'react';

interface EditProjectProps {
  project: Project;
  skills: SkillCatalogItem[];
}

/**
 * Edit project page that wires Inertia form state to the reusable ProjectForm.
 */
export default function Edit({ project, skills }: EditProjectProps) {
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );
  const supportedLocales = useSupportedLocales();
  const existingImages: ProjectImage[] = project.images ?? [];

  const initialSkillIds: number[] = project.skills.map((skill) => skill.id);

  const { data, setData, post, processing, transform } =
    usePageForm<ProjectFormData>({
      locale: project.locale,
      confirm_swap: false,
      name: project.name,
      summary: project.summary,
      description: project.description,
      status: project.status,
      repository_url: project.repository_url ?? '',
      live_url: project.live_url ?? '',
      display: project.display,
      skill_ids: initialSkillIds,
      images: [],
    });
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

  const [translationOpen, setTranslationOpen] = React.useState(false);
  const [swapDialogOpen, setSwapDialogOpen] = React.useState(false);
  const [pendingLocale, setPendingLocale] = React.useState<string | null>(null);
  const [translationLocales, setTranslationLocales] = React.useState<string[]>(
    [],
  );
  const [loadingTranslations, setLoadingTranslations] = React.useState(false);
  const [hasLocalesLoadError, setHasLocalesLoadError] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const loadTranslations = async (): Promise<void> => {
      setLoadingTranslations(true);
      setHasLocalesLoadError(false);
      try {
        const items = await listProjectTranslations(project.id);
        if (mounted) {
          setTranslationLocales(
            items.map((item) => item.locale).filter(Boolean),
          );
        }
      } catch {
        if (mounted) {
          setHasLocalesLoadError(true);
        }
      } finally {
        if (mounted) {
          setLoadingTranslations(false);
        }
      }
    };

    void loadTranslations();

    return () => {
      mounted = false;
    };
  }, [project.id]);

  const handleLocaleChange = (nextLocale: string): void => {
    if (nextLocale !== data.locale && translationLocales.includes(nextLocale)) {
      setPendingLocale(nextLocale);
      setSwapDialogOpen(true);
      return;
    }

    setData('confirm_swap', false);
    setData('locale', nextLocale);
  };

  return (
    <>
      <PageHead title={tActions('editProjectTitle', { name: project.name })} />

      <EditProjectContent
        project={project}
        skills={skills}
        existingImages={existingImages}
        supportedLocales={supportedLocales}
        data={data}
        formErrors={formErrors}
        processing={processing}
        hasLocalesLoadError={hasLocalesLoadError}
        loadingTranslations={loadingTranslations}
        onSubmit={submit}
        onChangeField={changeField}
        onChangeLocale={handleLocaleChange}
        onChangeSkillIds={changeSkillIds}
        onAddImageRow={addImageRow}
        onRemoveImageRow={removeImageRow}
        onUpdateImageAlt={updateImageAlt}
        onUpdateImageFile={updateImageFile}
        onOpenTranslations={() => setTranslationOpen(true)}
      />

      <TranslationModal
        open={translationOpen}
        onClose={() => setTranslationOpen(false)}
        projectId={project.id}
        projectLabel={project.name}
        baseLocale={data.locale}
      />

      {pendingLocale && (
        <LocaleSwapDialog
          open={swapDialogOpen}
          currentLocale={data.locale}
          nextLocale={pendingLocale}
          onConfirmSwap={() => {
            setData('confirm_swap', true);
            setData('locale', pendingLocale);
            setSwapDialogOpen(false);
            setPendingLocale(null);
          }}
          onConfirmNoSwap={() => {
            setData('confirm_swap', false);
            setData('locale', pendingLocale);
            setSwapDialogOpen(false);
            setPendingLocale(null);
          }}
          onCancel={() => {
            setSwapDialogOpen(false);
            setPendingLocale(null);
          }}
        />
      )}
    </>
  );
}

Edit.i18n = ['projects'];
Edit.layout = (page: React.ReactNode) => (
  <AuthenticatedLayout>{page}</AuthenticatedLayout>
);

type EditProjectContentProps = {
  project: Project;
  skills: SkillCatalogItem[];
  existingImages: ProjectImage[];
  supportedLocales: readonly string[];
  data: ProjectFormData;
  formErrors: FormErrors<keyof ProjectFormData>;
  processing: boolean;
  hasLocalesLoadError: boolean;
  loadingTranslations: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChangeField: <K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K],
  ) => void;
  onChangeLocale: (locale: string) => void;
  onChangeSkillIds: (ids: number[]) => void;
  onAddImageRow: () => void;
  onRemoveImageRow: (index: number) => void;
  onUpdateImageAlt: (index: number, value: string) => void;
  onUpdateImageFile: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onOpenTranslations: () => void;
};

function EditProjectContent({
  project,
  skills,
  existingImages,
  supportedLocales,
  data,
  formErrors,
  processing,
  hasLocalesLoadError,
  loadingTranslations,
  onSubmit,
  onChangeField,
  onChangeLocale,
  onChangeSkillIds,
  onAddImageRow,
  onRemoveImageRow,
  onUpdateImageAlt,
  onUpdateImageFile,
  onOpenTranslations,
}: EditProjectContentProps) {
  const { translate: tActions } = useProjectsTranslation(
    PROJECTS_NAMESPACES.actions,
  );
  const { translate: tTranslations } = useProjectsTranslation(
    PROJECTS_NAMESPACES.translations,
  );
  const { translate: tForm } = useProjectsTranslation(PROJECTS_NAMESPACES.form);
  const localeNote = hasLocalesLoadError
    ? tForm('errors.translationsLoad')
    : null;

  return (
    <PageContent className="overflow-hidden py-8" pageWidth="default">
      <div className="mb-6">
        <h1 className="text-xl leading-tight font-semibold">
          {tActions('editProjectTitle', { name: project.name })}
        </h1>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <PageLink
          href={route('projects.index')}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          {tActions('backToIndex')}
        </PageLink>

        <Button type="button" variant="secondary" onClick={onOpenTranslations}>
          {tTranslations('manage')}
        </Button>
      </div>

      <ProjectForm
        skills={skills}
        existingImages={existingImages}
        projectId={project.id}
        data={data}
        errors={formErrors}
        processing={processing}
        cancelHref={route('projects.index')}
        submitLabel={tActions('saveChanges')}
        supportedLocales={supportedLocales}
        localeDisabled={loadingTranslations || hasLocalesLoadError}
        localeNote={localeNote}
        onSubmit={onSubmit}
        onChangeField={onChangeField}
        onChangeLocale={onChangeLocale}
        onChangeSkillIds={onChangeSkillIds}
        onAddImageRow={onAddImageRow}
        onRemoveImageRow={onRemoveImageRow}
        onUpdateImageAlt={onUpdateImageAlt}
        onUpdateImageFile={onUpdateImageFile}
      />
    </PageContent>
  );
}
