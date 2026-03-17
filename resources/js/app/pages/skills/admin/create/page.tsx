// resources/js/Pages/Skills/Create.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import type { SkillFormData } from '@/modules/skills/core/forms';
import type { SkillCategory } from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';
import { SkillForm } from '@/modules/skills/ui/form/skill';
import React from 'react';

interface CreateSkillProps {
  categories: SkillCategory[];
}

const defaultSkillFormData: SkillFormData = {
  name: '',
  locale: '',
  skill_category_id: '',
};

export default function Create({ categories }: CreateSkillProps) {
  const { translate: tActions } = useSkillsTranslation(SKILLS_NAMESPACES.actions);
  const { translate: tSections } = useSkillsTranslation(
    SKILLS_NAMESPACES.sections,
  );
  const { data, setData, post, processing } = usePageForm<SkillFormData>(
    'skills.create',
    defaultSkillFormData,
  );
  const submitForm = useFormSubmit();
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof SkillFormData>;
  }>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    submitForm(event, post, route('skills.store'));
  };

  const handleChange = (
    field: keyof SkillFormData,
    value: string | number | '',
  ): void => {
    setData(field, value);
  };

  return (
    <AuthenticatedLayout>
      <PageHead title={tSections('createSkillTitle')} />

      <PageContent className="overflow-hidden py-8" pageWidth="form">
        <div className="mb-6">
          <h1 className="text-xl leading-tight font-semibold">
            {tSections('createSkillTitle')}
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
          submitLabel={tActions('save')}
        />
      </PageContent>
    </AuthenticatedLayout>
  );
}

Create.i18n = ['skills'];
