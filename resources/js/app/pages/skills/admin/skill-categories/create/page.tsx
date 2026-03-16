import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import type { FormErrors } from '@/common/forms';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import type { SkillCategoryFormData } from '@/modules/skills/core/forms';
import { SkillCategoryForm } from '@/modules/skills/ui/form/skill-category';
import React from 'react';

export default function Create() {
  const { data, setData, post, processing } = usePageForm<SkillCategoryFormData>({
    name: '',
    slug: '',
    locale: '',
  });
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
      <PageHead title="New skill category" />

      <PageContent className="overflow-hidden py-8" pageWidth="form">
        <div className="mb-6">
          <h1 className="text-xl leading-tight font-semibold">
            New skill category
          </h1>
        </div>

        <div className="mb-4">
          <PageLink
            href={route('skills.index')}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Back to skills
          </PageLink>
        </div>

        <SkillCategoryForm
          data={data}
          errors={formErrors}
          processing={processing}
          onChange={handleChange}
          onSubmit={handleSubmit}
          cancelHref={route('skills.index')}
          submitLabel="Save"
        />
      </PageContent>
    </AuthenticatedLayout>
  );
}
