import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { useSupportedLocales } from '@/common/locale';
import { useFormSubmit, type FormErrors } from '@/common/forms';
import { PageHead, PageLink, usePageForm, usePageProps } from '@/common/page-runtime';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';
import { useExperiencesTranslation } from '@/modules/experiences/i18n';
import { EXPERIENCES_NAMESPACES } from '@/modules/experiences/i18n';
import { ExperienceForm } from '@/modules/experiences/ui/form/experience';
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
  const { translate: tActions } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.actions,
  );
  const supportedLocales = useSupportedLocales();
  const { data, setData, post, processing } = usePageForm<ExperienceFormData>(
    'experiences.create',
    defaultExperienceFormData,
  );
  const submitForm = useFormSubmit();
  const { errors: formErrors } = usePageProps<{
    errors: FormErrors<keyof ExperienceFormData>;
  }>();
  const setExperienceData = setData as <K extends ExperienceEditableField>(
    field: K,
    value: ExperienceFormData[K],
  ) => void;

  const submit = (event: React.FormEvent<HTMLFormElement>): void => {
    submitForm(event, post, route('experiences.store'));
  };

  return (
    <AuthenticatedLayout>
      <PageHead title={tActions('newExperience')} />

      <CreateExperienceI18nContent
        data={data}
        formErrors={formErrors}
        processing={processing}
        supportedLocales={supportedLocales}
        onSubmit={submit}
        onChange={setExperienceData}
      />
    </AuthenticatedLayout>
  );
}

Create.i18n = ['experiences'];

type CreateExperienceI18nContentProps = {
  data: ExperienceFormData;
  formErrors: FormErrors<keyof ExperienceFormData>;
  processing: boolean;
  supportedLocales: readonly string[];
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: <K extends ExperienceEditableField>(
    field: K,
    value: ExperienceFormData[K],
  ) => void;
};

function CreateExperienceI18nContent({
  data,
  formErrors,
  processing,
  supportedLocales,
  onSubmit,
  onChange,
}: CreateExperienceI18nContentProps) {
  const { translate: tActions } = useExperiencesTranslation(
    EXPERIENCES_NAMESPACES.actions,
  );

  return (
    <PageContent className="overflow-hidden py-8" pageWidth="detail">
      <div className="mb-6">
        <h1 className="text-xl leading-tight font-semibold">
          {tActions('newExperience')}
        </h1>
      </div>

      <div className="mb-4">
        <PageLink
          href={route('experiences.index')}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          {tActions('backToIndex')}
        </PageLink>
      </div>

      <ExperienceForm
        data={data}
        errors={formErrors}
        processing={processing}
        supportedLocales={supportedLocales}
        cancelHref={route('experiences.index')}
        submitLabel={tActions('save')}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    </PageContent>
  );
}
