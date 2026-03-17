import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { SkillCategoryFormData } from '@/modules/skills/core/forms';

export function getErrorSummaryFields(
  errors: FormErrors<keyof SkillCategoryFormData>,
  t: (key: string) => string,
) {
  return collectErroredFieldLabels(errors, [
    { name: 'locale', label: t('fields.locale.label') },
    { name: 'name', label: t('fields.name.label') },
    { name: 'slug', label: t('fields.slug.label') },
  ] as const);
}
