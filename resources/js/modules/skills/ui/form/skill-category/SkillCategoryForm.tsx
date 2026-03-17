import {
  Form,
  FormActions,
  FormHeader,
  type FormErrors,
} from '@/common/forms';
import { TextInputField } from '@/common/forms';
import { useSupportedLocales } from '@/common/locale';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';

import { getErrorSummaryFields } from './errorSummaryFields';
import type { SkillCategoryFormProps } from './types';

/**
 * SkillCategoryForm renders the reusable skill category form fields.
 */
export function SkillCategoryForm({
  data,
  errors,
  processing,
  onChange,
  onSubmit,
  cancelHref,
  submitLabel,
  deleteHref,
  deleteLabel = 'Delete',
}: SkillCategoryFormProps) {
  const { translate: tForm } = useSkillsTranslation(SKILLS_NAMESPACES.form);
  const summaryFields = getErrorSummaryFields(errors, tForm);
  const supportedLocales = useSupportedLocales();

  return (
    <Form onSubmit={onSubmit} errors={errors} errorSummaryFields={summaryFields}>

      <FormHeader
        className="min-h-6"
        title={<h2 className="sr-only">{tForm('fields.locale.label')}</h2>}
        localeFieldProps={{
          value: data.locale,
          locales: supportedLocales,
          disabled: processing,
          errorId: 'skill-category-locale-error',
          errors: errors as FormErrors<string>,
          onChange: (value) => onChange('locale', value),
        }}
      />

      <TextInputField
        name="name"
        id="name"
        value={data.name}
        errors={errors}
        label={tForm('fields.name.label')}
        required
        disabled={processing}
        autoFocus
        onChange={(value) => onChange('name', value)}
      />

      <TextInputField
        name="slug"
        id="slug"
        value={data.slug}
        errors={errors}
        label={tForm('fields.slug.label')}
        placeholder={tForm('fields.slug.placeholder')}
        disabled={processing}
        onChange={(value) => onChange('slug', value)}
      />

      <FormActions
        cancelHref={cancelHref}
        submitLabel={submitLabel}
        processing={processing}
        deleteHref={deleteHref}
        deleteLabel={deleteLabel}
        showDeleteWhen="always"
      />
    </Form>
  );
}
