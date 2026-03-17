import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { SkillFormData } from '@/modules/skills/core/forms';

export function getErrorSummaryFields(
  errors: FormErrors<keyof SkillFormData>,
  t: (key: string) => string,
) {
  return collectErroredFieldLabels(errors, [
    { name: 'locale', label: t('fields.locale.label') },
    { name: 'name', label: t('fields.name.label') },
    { name: 'skill_category_id', label: t('fields.category.label') },
  ] as const);
}
