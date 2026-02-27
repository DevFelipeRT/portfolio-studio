import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { useSupportedLocales } from '@/common/i18n';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';
import { ExperienceForm } from '@/modules/experiences/ui/form/experience';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';

type ExperienceEditableField =
  | 'locale'
  | 'position'
  | 'company'
  | 'summary'
  | 'description'
  | 'start_date'
  | 'end_date'
  | 'display';

const defaultExperienceFormData: ExperienceFormData = {
  locale: '',
  position: '',
  company: '',
  summary: '',
  description: '',
  start_date: '',
  end_date: '',
  display: false,
};

export default function Create() {
  const supportedLocales = useSupportedLocales();
  const { data, setData, post, processing } = useForm<ExperienceFormData>(
    'experiences.create',
    defaultExperienceFormData,
  );
  const submitForm = useFormSubmit();
  const { errors: formErrors } = usePage().props as {
    errors: FormErrors<keyof ExperienceFormData>;
  };
  const setExperienceData = setData as <K extends ExperienceEditableField>(
    field: K,
    value: ExperienceFormData[K],
  ) => void;

  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    submitForm(event, post, route('experiences.store'));
  };

  return (
    <AuthenticatedLayout>
      <Head title="New experience" />

      <div className="overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link
              href={route('experiences.index')}
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Back to experiences
            </Link>
          </div>

          <ExperienceForm
            data={data}
            errors={formErrors}
            processing={processing}
            supportedLocales={supportedLocales}
            cancelHref={route('experiences.index')}
            submitLabel="Save experience"
            onSubmit={submit}
            onChange={setExperienceData}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
