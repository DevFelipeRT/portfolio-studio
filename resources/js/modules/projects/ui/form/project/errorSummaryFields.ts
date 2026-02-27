import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { ProjectFormData } from '@/modules/projects/core/forms';

export function getErrorSummaryFields(
  errors: FormErrors<keyof ProjectFormData>,
  t: (key: string) => string,
) {
  return collectErroredFieldLabels(errors, [
    { name: 'locale', label: t('fields.locale.label') },
    { name: 'name', label: 'Name' },
    { name: 'status', label: 'Status' },
    { name: 'summary', label: 'Summary' },
    { name: 'description', label: 'Description' },
    { name: 'display', label: 'Display on landing' },
    { name: 'repository_url', label: 'Repository URL' },
    { name: 'live_url', label: 'Live URL' },
    { name: 'skill_ids', label: 'Skills' },
    { name: 'images', label: 'Images' },
  ] as const);
}

