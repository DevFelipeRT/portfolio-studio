import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { SkillFormData } from '@/modules/skills/core/forms';

export function getErrorSummaryFields(errors: FormErrors<keyof SkillFormData>) {
  return collectErroredFieldLabels(errors, [
    { name: 'locale', label: 'Locale' },
    { name: 'name', label: 'Name' },
    { name: 'skill_category_id', label: 'Category' },
  ] as const);
}
