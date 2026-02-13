import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { LocaleSwapDialog } from '@/Common/LocaleSwapDialog';
import { Button } from '@/Components/Ui/button';
import { listSkillCategoryTranslations } from '@/Modules/Skills/core/api/translations';
import type { SkillCategoryFormData } from '@/Modules/Skills/core/forms';
import type { SkillCategory } from '@/Modules/Skills/core/types';
import { SkillCategoryForm } from '@/Modules/Skills/ui/SkillCategoryForm';
import { TranslationModal } from '@/Modules/Skills/ui/TranslationModal';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface EditSkillCategoryProps {
  category: SkillCategory;
}

export default function Edit({ category }: EditSkillCategoryProps) {
  const [showTranslations, setShowTranslations] = React.useState(false);
  const [swapDialogOpen, setSwapDialogOpen] = React.useState(false);
  const [pendingLocale, setPendingLocale] = React.useState<string | null>(null);
  const [translationLocales, setTranslationLocales] = React.useState<string[]>(
    [],
  );
  const [loadingTranslations, setLoadingTranslations] = React.useState(false);
  const [localesLoadError, setLocalesLoadError] = React.useState<string | null>(
    null,
  );
  const { data, setData, put, processing, errors } =
    useForm<SkillCategoryFormData>({
      name: category.name,
      slug: category.slug ?? '',
      locale: category.locale,
      confirm_swap: false,
    });

  React.useEffect(() => {
    let mounted = true;

    const loadTranslations = async (): Promise<void> => {
      setLoadingTranslations(true);
      setLocalesLoadError(null);
      try {
        const items = await listSkillCategoryTranslations(category.id);
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
  }, [category.id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    put(route('skill-categories.update', category.id));
  };

  const handleChange = (
    field: keyof SkillCategoryFormData,
    value: string,
  ): void => {
    if (field === 'locale') {
      if (value !== data.locale && translationLocales.includes(value)) {
        setPendingLocale(value);
        setSwapDialogOpen(true);
        return;
      }

      setData('confirm_swap', false);
    }
    setData(field, value);
  };

  return (
    <>
      <AuthenticatedLayout
        header={
          <h1 className="text-xl leading-tight font-semibold">
            Edit skill category
          </h1>
        }
      >
        <Head title={`Edit skill category: ${category.name}`} />

        <div className="overflow-hidden">
          <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-4">
              <Link
                href={route('skills.index')}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Back to skills
              </Link>
            </div>

            <SkillCategoryForm
              data={data}
              errors={errors}
              processing={processing}
              onChange={handleChange}
              onSubmit={handleSubmit}
              cancelHref={route('skills.index')}
              submitLabel="Save changes"
              deleteHref={route('skill-categories.destroy', category.id)}
              deleteLabel="Delete"
              alignActions="split"
            />

            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowTranslations(true)}
              >
                Manage translations
              </Button>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>

      <TranslationModal
        open={showTranslations}
        onClose={() => setShowTranslations(false)}
        entityId={category.id}
        entityLabel={category.name}
        entityType="skill-category"
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
