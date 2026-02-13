import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { useSupportedLocales, useTranslation } from '@/Common/i18n';
import { LocaleSwapDialog } from '@/Common/LocaleSwapDialog';
import { RichTextEditor } from '@/Common/RichText/RichTextEditor';
import { Button } from '@/Components/Ui/button';
import { Checkbox } from '@/Components/Ui/checkbox';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/Ui/select';
import { listExperienceTranslations } from '@/Modules/Experiences/core/api/translations';
import type { ExperienceFormData } from '@/Modules/Experiences/core/forms';
import type { Experience } from '@/Modules/Experiences/core/types';
import { TranslationModal } from '@/Modules/Experiences/ui/TranslationModal';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface EditExperienceProps {
  experience: Experience;
}

export default function Edit({ experience }: EditExperienceProps) {
  const { translate: t } = useTranslation('experience');
  const supportedLocales = useSupportedLocales();
  const { data, setData, put, processing, errors } =
    useForm<ExperienceFormData>({
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

  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    put(route('experiences.update', experience.id));
  };

  const normalizeError = (
    message: string | string[] | undefined,
  ): string | null => {
    if (!message) {
      return null;
    }

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    return message;
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

          <form
            onSubmit={submit}
            className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
          >
            <section className="space-y-4">
              <h2 className="text-lg font-medium">Experience details</h2>

              <div className="space-y-1.5">
                <Label htmlFor="locale">{t('fields.locale.label')}</Label>
                <Select
                  value={data.locale}
                  onValueChange={handleLocaleChange}
                  disabled={
                    processing ||
                    loadingTranslations ||
                    Boolean(localesLoadError)
                  }
                >
                  <SelectTrigger id="locale">
                    <SelectValue placeholder={t('fields.locale.placeholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLocales.map((locale) => (
                      <SelectItem key={locale} value={locale}>
                        {locale}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.locale && (
                  <p className="text-destructive text-sm">
                    {normalizeError(errors.locale)}
                  </p>
                )}
                {localesLoadError && (
                  <p className="text-muted-foreground text-xs">
                    {localesLoadError}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={data.position}
                    onChange={(event) =>
                      setData('position', event.target.value)
                    }
                  />
                  {errors.position && (
                    <p className="text-destructive text-sm">
                      {normalizeError(errors.position)}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={data.company}
                    onChange={(event) => setData('company', event.target.value)}
                  />
                  {errors.company && (
                    <p className="text-destructive text-sm">
                      {normalizeError(errors.company)}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="summary">Summary</Label>
                <Input
                  id="summary"
                  value={data.summary}
                  onChange={(event) => setData('summary', event.target.value)}
                />
                {errors.summary && (
                  <p className="text-destructive text-sm">
                    {normalizeError(errors.summary)}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <RichTextEditor
                  id="description"
                  value={data.description}
                  onChange={(value) => setData('description', value)}
                />
                {errors.description && (
                  <p className="text-destructive text-sm">
                    {normalizeError(errors.description)}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="start_date">Start date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={data.start_date}
                    onChange={(event) =>
                      setData('start_date', event.target.value)
                    }
                  />
                  {errors.start_date && (
                    <p className="text-destructive text-sm">
                      {normalizeError(errors.start_date)}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="end_date">End date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={data.end_date}
                    onChange={(event) =>
                      setData('end_date', event.target.value)
                    }
                  />
                  {errors.end_date && (
                    <p className="text-destructive text-sm">
                      {normalizeError(errors.end_date)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="display"
                  checked={data.display}
                  onCheckedChange={(checked) => setData('display', !!checked)}
                />
                <label
                  htmlFor="display"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Display on portfolio
                </label>
              </div>
              {errors.display && (
                <p className="text-destructive text-sm">
                  {normalizeError(errors.display)}
                </p>
              )}
            </section>

            <div className="flex items-center justify-end gap-3">
              <Link
                href={route('experiences.index')}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Cancel
              </Link>

              <Button type="submit" disabled={processing}>
                Save changes
              </Button>
            </div>
          </form>
        </div>
      </div>

      <TranslationModal
        open={translationOpen}
        onClose={() => setTranslationOpen(false)}
        experienceId={experience.id}
        experienceLabel={experience.position}
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
