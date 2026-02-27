import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { CourseFormData } from '@/modules/courses/core/forms';

export function getErrorSummaryFields(
  errors: FormErrors<keyof CourseFormData>,
  t: (key: string) => string,
) {
  return collectErroredFieldLabels(errors, [
    { name: 'locale', label: t('fields.locale.label') },
    { name: 'name', label: t('fields.name.label') },
    { name: 'institution', label: t('fields.institution.label') },
    { name: 'category', label: t('fields.category.label') },
    { name: 'summary', label: t('fields.summary.label') },
    { name: 'description', label: t('fields.description.label') },
    { name: 'started_at', label: t('fields.started_at.label') },
    { name: 'completed_at', label: t('fields.completed_at.label') },
    { name: 'display', label: t('fields.display.label') },
  ] as const);
}

