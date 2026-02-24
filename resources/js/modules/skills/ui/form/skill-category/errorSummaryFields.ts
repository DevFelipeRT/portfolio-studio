import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { SkillCategoryFormData } from '@/modules/skills/core/forms';

export function getErrorSummaryFields(errors: FormErrors<keyof SkillCategoryFormData>) {
  return collectErroredFieldLabels(errors, [
    { name: 'locale', label: 'Locale' },
    { name: 'name', label: 'Name' },
    { name: 'slug', label: 'Slug' },
  ] as const);
}
