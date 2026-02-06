// resources/js/Pages/Skills/Edit.tsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { SkillFormData } from '@/Modules/Skills/core/forms';
import type { Skill, SkillCategory } from '@/Modules/Skills/core/types';
import { SkillForm } from '@/Modules/Skills/ui/SkillForm';
import { TranslationModal } from '@/Modules/Skills/ui/TranslationModal';
import { Button } from '@/Components/Ui/button';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface EditSkillProps {
  skill: Skill;
  categories: SkillCategory[];
}

export default function Edit({ skill, categories }: EditSkillProps) {
  const [showTranslations, setShowTranslations] = React.useState(false);
  const { data, setData, put, processing, errors } = useForm<SkillFormData>({
    name: skill.name,
    locale: skill.locale,
    skill_category_id: skill.skill_category_id ?? '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    put(route('skills.update', skill.id));
  };

  const handleChange = (
    field: keyof SkillFormData,
    value: string | number | '',
  ): void => {
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
              errors={errors}
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
        baseLocale={skill.locale}
      />
    </>
  );
}
