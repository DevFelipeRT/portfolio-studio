import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { useSupportedLocales, useTranslation } from '@/Common/i18n';
import { LocaleSwapDialog } from '@/Common/LocaleSwapDialog';
import { Button } from '@/Components/Ui/button';
import { listProjectTranslations } from '@/Modules/Projects/core/api/translations';
import type {
  ImageInput,
  ProjectFormData,
} from '@/Modules/Projects/core/forms';
import type { Project, ProjectImage } from '@/Modules/Projects/core/types';
import { ProjectForm } from '@/Modules/Projects/ui/ProjectForm';
import { TranslationModal } from '@/Modules/Projects/ui/TranslationModal';
import type { Skill } from '@/Modules/Skills/core/types';
import { Head, Link, useForm } from '@inertiajs/react';
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

  const { data, setData, post, processing, errors, transform } =
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

  function changeField<K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K],
  ): void {
    setData((current: ProjectFormData) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleSkill(id: number): void {
    setData((current: ProjectFormData) => {
      const exists = current.skill_ids.includes(id);

      return {
        ...current,
        skill_ids: exists
          ? current.skill_ids.filter((item: number) => item !== id)
          : [...current.skill_ids, id],
      };
    });
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
      preserveScroll: true,
    });
  };

  function normalizeError(
    message: string | string[] | undefined,
  ): string | null {
    if (!message) {
      return null;
    }

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    return message;
  }

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
      } catch (err) {
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
            errors={errors}
            processing={processing}
            submitLabel="Save changes"
            supportedLocales={supportedLocales}
            localeDisabled={loadingTranslations || Boolean(localesLoadError)}
            onSubmit={submit}
            onChangeField={changeField}
            onChangeLocale={handleLocaleChange}
            onToggleSkill={toggleSkill}
            onAddImageRow={addImageRow}
            onRemoveImageRow={removeImageRow}
            onUpdateImageAlt={updateImageAlt}
            onUpdateImageFile={updateImageFile}
            normalizeError={normalizeError}
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
