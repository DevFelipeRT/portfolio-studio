import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { useSupportedLocales, useTranslation } from '@/common/i18n';
import { LocaleSwapDialog } from '@/common/LocaleSwapDialog';
import type { FormErrors } from '@/common/forms';
import { Button } from '@/components/ui/button';
import { listExperienceTranslations } from '@/modules/experiences/core/api/translations';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';
import type { Experience } from '@/modules/experiences/core/types';
import { ExperienceForm } from '@/modules/experiences/ui/ExperienceForm';
import { TranslationModal } from '@/modules/experiences/ui/TranslationModal';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
  const { translate: t } = useTranslation('experience');
  const supportedLocales = useSupportedLocales();
  const { data, setData, put, processing } = useForm<ExperienceFormData>({
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
  const { errors: formErrors } = usePage().props as {
    errors: FormErrors<keyof ExperienceFormData>;
  };
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
  }, [experience.id]);

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
      <Head title="Edit experience" />

      <div className="overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Link
              href={route('experiences.index')}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Back to experiences
            </Link>

            <Button
              type="button"
              variant="secondary"
              onClick={() => setTranslationOpen(true)}
            >
              {t('translations.manage')}
            </Button>

            <span className="text-muted-foreground text-xs">
              Editing: {experience.position} at {experience.company ?? '—'}
            </span>
          </div>

          <ExperienceForm
            data={data}
            errors={formErrors}
            processing={processing}
            supportedLocales={supportedLocales}
            cancelHref={route('experiences.index')}
            submitLabel="Save changes"
            localeDisabled={loadingTranslations || Boolean(localesLoadError)}
            localeNote={localesLoadError}
            onSubmit={submit}
            onChange={setExperienceData}
            onLocaleChange={handleLocaleChange}
          />
        </div>
      </div>

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
