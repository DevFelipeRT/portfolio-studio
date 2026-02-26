// resources/js/Pages/Skills/Create.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import type { SkillFormData } from '@/modules/skills/core/forms';
import type { SkillCategory } from '@/modules/skills/core/types';
import { SkillForm } from '@/modules/skills/ui/form/skill';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
  const { data, setData, post, processing } = useForm<SkillFormData>(
    'skills.create',
    defaultSkillFormData,
  );
  const submitForm = useFormSubmit();
  const { errors: formErrors } = usePage().props as {
    errors: FormErrors<keyof SkillFormData>;
  };

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
    <AuthenticatedLayout
      header={
        <h1 className="text-xl leading-tight font-semibold">New skill</h1>
      }
    >
      <Head title="New skill" />

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
            submitLabel="Save"
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
