import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { useSupportedLocales } from '@/common/locale';
import { LocaleSwapDialog } from '@/common/LocaleSwapDialog';
import type { FormErrors } from '@/common/forms';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import { Button } from '@/components/ui/button';
import { listExperienceTranslations } from '@/modules/experiences/core/api/translations';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';
import type { Experience } from '@/modules/experiences/core/types';
import { useExperiencesTranslation } from '@/modules/experiences/i18n';
import { EXPERIENCES_NAMESPACES } from '@/modules/experiences/i18n';
import { ExperienceForm } from '@/modules/experiences/ui/form/experience';
import { TranslationModal } from '@/modules/experiences/ui/TranslationModal';
import React from 'react';

interface EditExperienceProps {
  experience: Experience;
}

type ExperienceEditableField =
  | 'locale'
  | 'position'
  | 'company'
  | 'summary'
  | 'description'
  | 'start_date'
  | 'end_date'
  | 'display';

export default function Edit({ experience }: EditExperienceProps) {
  const { translate: tActions } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.actions,
  );
  const { translate: tForm } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.form,
  );
  const supportedLocales = useSupportedLocales();
  const { data, setData, put, processing } = usePageForm<ExperienceFormData>({
    locale: experience.locale,
    confirm_swap: false,
    position: experience.position,
    company: experience.company ?? '',
    summary: experience.summary ?? '',
    description: experience.description,
    start_date: experience.start_date,
    end_date: experience.end_date ?? '',
    display: experience.display,
  });
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof ExperienceFormData>;
  }>();
  const setExperienceData = setData as <K extends ExperienceEditableField>(
    field: K,
    value: ExperienceFormData[K],
  ) => void;

  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    put(route('experiences.update', experience.id), {
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
        const items = await listExperienceTranslations(experience.id);
        if (mounted) {
          setTranslationLocales(
            items.map((item) => item.locale).filter(Boolean),
          );
        }
      } catch {
        if (mounted) {
          setLocalesLoadError(tForm('errors.translationsLoad'));
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
  }, [experience.id, tForm]);

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
    <AuthenticatedLayout>
      <PageHead title={tActions('editExperience')} />

      <EditExperienceI18nContent
        experience={experience}
        data={data}
        formErrors={formErrors}
        processing={processing}
        supportedLocales={supportedLocales}
        localesLoadError={localesLoadError}
        loadingTranslations={loadingTranslations}
        onSubmit={submit}
        onChange={setExperienceData}
        onLocaleChange={handleLocaleChange}
        onOpenTranslations={() => setTranslationOpen(true)}
      />

      <TranslationModal
        open={translationOpen}
        onClose={() => setTranslationOpen(false)}
        experienceId={experience.id}
        experienceLabel={`${experience.position} - ${experience.company ?? ''}`}
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

Edit.i18n = ['experiences'];

type EditExperienceI18nContentProps = {
  experience: Experience;
  data: ExperienceFormData;
  formErrors: FormErrors<keyof ExperienceFormData>;
  processing: boolean;
  supportedLocales: readonly string[];
  localesLoadError: string | null;
  loadingTranslations: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: <K extends ExperienceEditableField>(
    field: K,
    value: ExperienceFormData[K],
  ) => void;
  onLocaleChange: (locale: string) => void;
  onOpenTranslations: () => void;
};

function EditExperienceI18nContent({
  experience,
  data,
  formErrors,
  processing,
  supportedLocales,
  localesLoadError,
  loadingTranslations,
  onSubmit,
  onChange,
  onLocaleChange,
  onOpenTranslations,
}: EditExperienceI18nContentProps) {
  const { translate: tActions } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.actions,
  );
  const { translate: tTranslations } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.translations,
  );
  const { translate: tForm } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.form,
  );

  return (
    <PageContent className="overflow-hidden py-8" pageWidth="detail">
      <div className="mb-6">
        <h1 className="text-xl leading-tight font-semibold">
          {tActions('editExperience')}
        </h1>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <PageLink
          href={route('experiences.index')}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          {tActions('backToIndex')}
        </PageLink>

        <Button type="button" variant="secondary" onClick={onOpenTranslations}>
          {tTranslations('manage')}
        </Button>

        <span className="text-muted-foreground text-xs">
          {tForm('status.editing', {
            position: experience.position,
            company: experience.company ?? tForm('values.empty'),
          })}
        </span>
      </div>

      <ExperienceForm
        data={data}
        errors={formErrors}
        processing={processing}
        supportedLocales={supportedLocales}
        cancelHref={route('experiences.index')}
        submitLabel={tActions('saveChanges')}
        localeDisabled={loadingTranslations || Boolean(localesLoadError)}
        localeNote={localesLoadError}
        onSubmit={onSubmit}
        onChange={onChange}
        onLocaleChange={onLocaleChange}
      />
    </PageContent>
  );
}
