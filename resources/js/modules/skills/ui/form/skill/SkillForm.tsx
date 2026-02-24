import { FormErrorSummary } from '@/common/forms';

import { getErrorSummaryFields } from './errorSummaryFields';
import { SkillFormActions } from './partials/SkillFormActions';
import { LocaleField } from './partials/fields/LocaleField';
import { NameField } from './partials/fields/NameField';
import { SkillCategoryField } from './partials/fields/SkillCategoryField';
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
  alignActions = 'right',
}: SkillFormProps) {
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

      <SkillCategoryField
        value={data.skill_category_id}
        errors={errors}
        categories={categories}
        processing={processing}
        onChange={(value) => onChange('skill_category_id', value)}
      />

      <SkillFormActions
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
