import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import type { FormErrors } from '@/common/forms';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import type { SkillCategoryFormData } from '@/modules/skills/core/forms';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';
import { SkillCategoryForm } from '@/modules/skills/ui/form/skill-category';
import React from 'react';

interface CreateSkillCategoryProps {
  initial: SkillCategoryFormData;
}

export default function Create({ initial }: CreateSkillCategoryProps) {
  const { translate: tActions } = useSkillsTranslation(SKILLS_NAMESPACES.actions);
  const { translate: tSections } = useSkillsTranslation(
    SKILLS_NAMESPACES.sections,
  );
  const { data, setData, post, processing } = usePageForm<SkillCategoryFormData>(
    initial,
  );
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof SkillCategoryFormData>;
  }>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    post(route('skill-categories.store'), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleChange = (
    field: keyof SkillCategoryFormData,
    value: string,
  ): void => {
    setData(field, value);
  };

  return (
    <AuthenticatedLayout>
      <PageHead title={tSections('createCategoryTitle')} />

      <PageContent className="overflow-hidden py-8" pageWidth="form">
        <div className="mb-6">
          <h1 className="text-xl leading-tight font-semibold">
            {tSections('createCategoryTitle')}
          </h1>
        </div>

        <div className="mb-4">
          <PageLink
            href={route('skill-categories.index')}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            {tActions('backToCategories')}
          </PageLink>
        </div>

        <SkillCategoryForm
          data={data}
          errors={formErrors}
          processing={processing}
          onChange={handleChange}
          onSubmit={handleSubmit}
          cancelHref={route('skill-categories.index')}
          submitLabel={tActions('save')}
        />
      </PageContent>
    </AuthenticatedLayout>
  );
}

Create.i18n = ['skills'];
