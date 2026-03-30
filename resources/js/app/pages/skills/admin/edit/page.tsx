// resources/js/Pages/Skills/Edit.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import type { FormErrors } from '@/common/forms';
import { LocaleSwapDialog } from '@/common/LocaleSwapDialog';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import { Button } from '@/components/ui/button';
import { listSkillTranslations } from '@/modules/skills/core/api/translations';
import type { SkillFormData } from '@/modules/skills/core/forms';
import type {
  AdminSkillCategoryRecord,
  AdminSkillListItem,
} from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';
import { SkillForm } from '@/modules/skills/ui/form/skill';
import { TranslationModal } from '@/modules/skills/ui/TranslationModal';
import React from 'react';

interface EditSkillProps {
  skill: AdminSkillListItem;
  categories: AdminSkillCategoryRecord[];
  initial: SkillFormData;
}

export default function Edit({ skill, categories, initial }: EditSkillProps) {
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
  const { data, setData, put, processing } = usePageForm<SkillFormData>(initial);
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof SkillFormData>;
  }>();

  React.useEffect(() => {
    let mounted = true;

    const loadTranslations = async (): Promise<void> => {
      try {
        const items = await listSkillTranslations(skill.id);
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
  }, [skill.id]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    put(route('skills.update', skill.id), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleChange = (
    field: keyof SkillFormData,
    value: string | number | '',
  ): void => {
    if (field === 'locale' && typeof value === 'string') {
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
        <PageHead title={tActions('editSkill')} />

        <PageContent className="overflow-hidden py-8" pageWidth="form">
          <div className="mb-6">
            <h1 className="text-xl leading-tight font-semibold">
              {tSections('editSkillTitle')}
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

          <SkillForm
            data={data}
            errors={formErrors}
            categories={categories}
            processing={processing}
            onChange={handleChange}
            onSubmit={handleSubmit}
            cancelHref={route('skills.index')}
            submitLabel={tActions('saveChanges')}
            deleteHref={route('skills.destroy', skill.id)}
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
        entityId={skill.id}
        entityLabel={skill.name}
        entityType="skill"
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
