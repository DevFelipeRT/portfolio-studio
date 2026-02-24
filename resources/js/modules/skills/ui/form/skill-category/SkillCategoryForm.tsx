import { FormErrorSummary } from '@/common/forms';

import { getErrorSummaryFields } from './errorSummaryFields';
import { SkillCategoryFormActions } from './partials/SkillCategoryFormActions';
import { LocaleField } from './partials/fields/LocaleField';
import { NameField } from './partials/fields/NameField';
import { SlugField } from './partials/fields/SlugField';
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

  return (
    <form
      onSubmit={onSubmit}
      className="bg-card space-y-6 rounded-lg border p-6 shadow-sm"
    >
      <FormErrorSummary fields={summaryFields} />

      <LocaleField
        value={data.locale}
        errors={errors}
        processing={processing}
        onChange={(value) => onChange('locale', value)}
      />

      <NameField
        value={data.name}
        errors={errors}
        processing={processing}
        autoFocus
        onChange={(value) => onChange('name', value)}
      />

      <SlugField
        value={data.slug}
        errors={errors}
        processing={processing}
        onChange={(value) => onChange('slug', value)}
      />

      <SkillCategoryFormActions
        cancelHref={cancelHref}
        submitLabel={submitLabel}
        processing={processing}
        deleteHref={deleteHref}
        deleteLabel={deleteLabel}
        alignActions={alignActions}
      />
    </form>
  );
}
