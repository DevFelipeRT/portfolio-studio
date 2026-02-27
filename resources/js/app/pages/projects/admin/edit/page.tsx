import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import type { FormErrors } from '@/common/forms';
import { useSupportedLocales, useTranslation } from '@/common/i18n';
import { LocaleSwapDialog } from '@/common/LocaleSwapDialog';
import { Button } from '@/components/ui/button';
import { listProjectTranslations } from '@/modules/projects/core/api/translations';
import type {
  ImageInput,
  ProjectFormData,
} from '@/modules/projects/core/forms';
import type { Project, ProjectImage } from '@/modules/projects/core/types';
import { ProjectForm } from '@/modules/projects/ui/form/project';
import { TranslationModal } from '@/modules/projects/ui/TranslationModal';
import type { Skill } from '@/modules/skills/core/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

interface EditProjectProps {
  project: Project;
  skills: Skill[];
}

/**
 * Edit project page that wires Inertia form state to the reusable ProjectForm.
 */
export default function Edit({ project, skills }: EditProjectProps) {
  const { translate: t } = useTranslation('projects');
  const supportedLocales = useSupportedLocales();
  const existingImages: ProjectImage[] = project.images ?? [];

  const initialSkillIds: number[] = project.skills.map(
    (skill: Skill) => skill.id,
  );

  const { data, setData, post, processing, transform } =
    useForm<ProjectFormData>({
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
  const { errors: formErrors } = usePage().props as {
    errors: FormErrors<keyof ProjectFormData>;
  };

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
  const [localesLoadError, setLocalesLoadError] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    let mounted = true;

    const loadTranslations = async (): Promise<void> => {
      setLoadingTranslations(true);
      setLocalesLoadError(null);
      try {
        const items = await listProjectTranslations(project.id);
        if (mounted) {
          setTranslationLocales(
            items.map((item) => item.locale).filter(Boolean),
          );
        }
      } catch {
        if (mounted) {
          setLocalesLoadError(
            'Unable to load translations for locale conflict checks.',
          );
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
    <AuthenticatedLayout
      header={
        <h1 className="text-xl leading-tight font-semibold">Edit project</h1>
      }
    >
      <Head title={`Edit project: ${project.name}`} />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Link
              href={route('projects.index')}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Back to projects
            </Link>

            <Button
              type="button"
              variant="secondary"
              onClick={() => setTranslationOpen(true)}
            >
              {t('translations.manage')}
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
            submitLabel="Save changes"
            supportedLocales={supportedLocales}
            localeDisabled={loadingTranslations || Boolean(localesLoadError)}
            onSubmit={submit}
            onChangeField={changeField}
            onChangeLocale={handleLocaleChange}
            onChangeSkillIds={changeSkillIds}
            onAddImageRow={addImageRow}
            onRemoveImageRow={removeImageRow}
            onUpdateImageAlt={updateImageAlt}
            onUpdateImageFile={updateImageFile}
          />

          {localesLoadError && (
            <p className="text-muted-foreground mt-3 text-xs">
              {localesLoadError}
            </p>
          )}
        </div>
      </div>

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
    </AuthenticatedLayout>
  );
}
