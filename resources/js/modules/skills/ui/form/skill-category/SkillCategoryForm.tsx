import {
  Form,
  FormActions,
  FormHeader,
  type FormErrors,
} from '@/common/forms';
import { TextInputField } from '@/common/forms';
import { useSupportedLocales } from '@/common/i18n';

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
  alignActions = 'right',
}: SkillCategoryFormProps) {
  const summaryFields = getErrorSummaryFields(errors);
  const supportedLocales = useSupportedLocales();

  return (
    <Form onSubmit={onSubmit} errors={errors} errorSummaryFields={summaryFields}>

      <FormHeader
        className="min-h-6"
        title={<h2 className="sr-only">Translations</h2>}
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
        label="Name"
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
        label="Slug"
        placeholder="Leave blank to auto-generate"
        disabled={processing}
        onChange={(value) => onChange('slug', value)}
      />

      <FormActions
        cancelHref={cancelHref}
        submitLabel={submitLabel}
        processing={processing}
        deleteHref={deleteHref}
        deleteLabel={deleteLabel}
        align={alignActions}
      />
    </Form>
  );
}
