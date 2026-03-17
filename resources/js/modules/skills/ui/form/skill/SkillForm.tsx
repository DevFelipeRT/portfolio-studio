import {
  Form,
  FormActions,
  FormHeader,
  type FormErrors,
} from '@/common/forms';
import { SelectField, TextInputField } from '@/common/forms';
import { useSupportedLocales } from '@/common/locale';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';

import { getErrorSummaryFields } from './errorSummaryFields';
import type { SkillFormProps } from './types';

/**
 * SkillForm renders the reusable skill form fields and actions.
 */
export function SkillForm({
  data,
  errors,
  categories,
  processing,
  onChange,
  onSubmit,
  cancelHref,
  submitLabel,
  deleteHref,
  deleteLabel = 'Delete',
}: SkillFormProps) {
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
          errorId: 'skill-locale-error',
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

      <SelectField
        name="skill_category_id"
        id="category"
        value={data.skill_category_id === '' ? '__none__' : String(data.skill_category_id)}
        errors={errors}
        label={tForm('fields.category.label')}
        placeholder={tForm('fields.category.placeholder')}
        disabled={processing}
        errorId="skill-category-id-error"
        options={[
          {
            value: '__none__',
            label: tForm('fields.category.uncategorized'),
          },
          ...categories.map((category) => ({
            value: String(category.id),
            label: category.name,
          })),
        ]}
        onChange={(nextValue) =>
          onChange(
            'skill_category_id',
            nextValue === '__none__' ? '' : Number(nextValue),
          )
        }
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
