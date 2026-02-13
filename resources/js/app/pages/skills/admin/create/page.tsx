// resources/js/Pages/Skills/Create.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import type { SkillFormData } from '@/modules/skills/core/forms';
import type { SkillCategory } from '@/modules/skills/core/types';
import { SkillForm } from '@/modules/skills/ui/SkillForm';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface CreateSkillProps {
  categories: SkillCategory[];
}

export default function Create({ categories }: CreateSkillProps) {
  const { data, setData, post, processing, errors } = useForm<SkillFormData>({
    name: '',
    locale: '',
    skill_category_id: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    post(route('skills.store'));
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
            errors={errors}
            categories={categories}
            processing={processing}
            onChange={handleChange}
            onSubmit={handleSubmit}
            cancelHref={route('skills.index')}
            submitLabel="Save"
            alignActions="right"
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
