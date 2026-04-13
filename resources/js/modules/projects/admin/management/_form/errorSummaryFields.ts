import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { ProjectFormData } from '@/modules/projects/admin/management/types';

export function getErrorSummaryFields(
  errors: FormErrors<keyof ProjectFormData>,
  t: (key: string) => string,
) {
  return collectErroredFieldLabels(errors, [
    { name: 'locale', label: t('fields.locale.label') },
    { name: 'name', label: t('fields.name.label') },
    { name: 'status', label: t('fields.status.label') },
    { name: 'summary', label: t('fields.summary.label') },
    { name: 'description', label: t('fields.description.label') },
    { name: 'display', label: t('fields.display.label') },
    { name: 'repository_url', label: t('fields.repository_url.label') },
    { name: 'live_url', label: t('fields.live_url.label') },
    { name: 'skill_ids', label: t('fields.skill_ids.label') },
    { name: 'images', label: t('fields.images.label') },
  ] as const);
}
