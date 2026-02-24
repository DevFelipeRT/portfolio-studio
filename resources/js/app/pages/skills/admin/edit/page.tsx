// resources/js/Pages/Skills/Edit.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import type { FormErrors } from '@/common/forms';
import { LocaleSwapDialog } from '@/common/LocaleSwapDialog';
import { Button } from '@/components/ui/button';
import { listSkillTranslations } from '@/modules/skills/core/api/translations';
import type { SkillFormData } from '@/modules/skills/core/forms';
import type { Skill, SkillCategory } from '@/modules/skills/core/types';
import { SkillForm } from '@/modules/skills/ui/form/skill';
import { TranslationModal } from '@/modules/skills/ui/TranslationModal';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

interface EditSkillProps {
  skill: Skill;
  categories: SkillCategory[];
}

export default function Edit({ skill, categories }: EditSkillProps) {
  const [showTranslations, setShowTranslations] = React.useState(false);
  const [swapDialogOpen, setSwapDialogOpen] = React.useState(false);
  const [pendingLocale, setPendingLocale] = React.useState<string | null>(null);
  const [translationLocales, setTranslationLocales] = React.useState<string[]>(
    [],
  );
  const { data, setData, put, processing } = useForm<SkillFormData>({
    name: skill.name,
    locale: skill.locale,
    confirm_swap: false,
    skill_category_id: skill.skill_category_id ?? '',
  });
  const { errors: formErrors } = usePage().props as {
    errors: FormErrors<keyof SkillFormData>;
  };

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
      <AuthenticatedLayout
        header={
          <h1 className="text-xl leading-tight font-semibold">Edit skill</h1>
        }
      >
        <Head title={`Edit skill: ${skill.name}`} />

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

            <SkillForm
              data={data}
              errors={formErrors}
              categories={categories}
              processing={processing}
              onChange={handleChange}
              onSubmit={handleSubmit}
              cancelHref={route('skills.index')}
              submitLabel="Save changes"
              deleteHref={route('skills.destroy', skill.id)}
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
