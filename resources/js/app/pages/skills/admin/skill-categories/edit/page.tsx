import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import type { FormErrors } from '@/common/forms';
import { LocaleSwapDialog } from '@/common/LocaleSwapDialog';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import { Button } from '@/components/ui/button';
import { listSkillCategoryTranslations } from '@/modules/skills/core/api/translations';
import type { SkillCategoryFormData } from '@/modules/skills/core/forms';
import type { SkillCategory } from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';
import { SkillCategoryForm } from '@/modules/skills/ui/form/skill-category';
import { TranslationModal } from '@/modules/skills/ui/TranslationModal';
import React from 'react';

interface EditSkillCategoryProps {
  category: SkillCategory;
}

export default function Edit({ category }: EditSkillCategoryProps) {
  const { translate: tActions } = useSkillsTranslation(SKILLS_NAMESPACES.actions);
  const { translate: tSections } = useSkillsTranslation(
    SKILLS_NAMESPACES.sections,
  );
  const [showTranslations, setShowTranslations] = React.useState(false);
  const [swapDialogOpen, setSwapDialogOpen] = React.useState(false);
  const [pendingLocale, setPendingLocale] = React.useState<string | null>(null);
  const [translationLocales, setTranslationLocales] = React.useState<string[]>(
    [],
  );
  const { data, setData, put, processing } = usePageForm<SkillCategoryFormData>({
    name: category.name,
    slug: category.slug ?? '',
    locale: category.locale,
    confirm_swap: false,
  });
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof SkillCategoryFormData>;
  }>();

  React.useEffect(() => {
    let mounted = true;

    const loadTranslations = async (): Promise<void> => {
      try {
        const items = await listSkillCategoryTranslations(category.id);
        if (mounted) {
          setTranslationLocales(
            items.map((item) => item.locale).filter(Boolean),
          );
        }
      } catch {
        // Locale conflict checks are optional in this flow.
      }
    };

    void loadTranslations();

    return () => {
      mounted = false;
    };
  }, [category.id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    put(route('skill-categories.update', category.id), {
      preserveState: true,
      preserveScroll: true,
    });
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
      <AuthenticatedLayout>
        <PageHead title={tActions('editSkillCategory')} />

        <PageContent className="overflow-hidden py-8" pageWidth="form">
          <div className="mb-6">
            <h1 className="text-xl leading-tight font-semibold">
              {tSections('editCategoryTitle')}
            </h1>
          </div>

          <div className="mb-4">
            <PageLink
              href={route('skills.index')}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              {tActions('backToIndex')}
            </PageLink>
          </div>

          <SkillCategoryForm
            data={data}
            errors={formErrors}
            processing={processing}
            onChange={handleChange}
            onSubmit={handleSubmit}
            cancelHref={route('skills.index')}
            submitLabel={tActions('saveChanges')}
            deleteHref={route('skill-categories.destroy', category.id)}
            deleteLabel={tActions('delete')}
          />

          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowTranslations(true)}
            >
              {tActions('manageTranslations')}
            </Button>
          </div>
        </PageContent>
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

Edit.i18n = ['skills'];
