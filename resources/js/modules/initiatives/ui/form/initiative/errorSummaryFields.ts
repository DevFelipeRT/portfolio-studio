import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { InitiativeFormData } from '@/modules/initiatives/core/forms';

export function getErrorSummaryFields(
  errors: FormErrors<keyof InitiativeFormData>,
  t: (key: string) => string,
) {
  return collectErroredFieldLabels(errors, [
    { name: 'locale', label: t('fields.locale.label') },
    { name: 'name', label: t('fields.name.label') },
    { name: 'start_date', label: t('fields.start_date.label') },
    { name: 'summary', label: t('fields.summary.label') },
    { name: 'end_date', label: t('fields.end_date.label') },
    { name: 'description', label: t('fields.description.label') },
    { name: 'display', label: t('fields.display.label') },
    { name: 'images', label: t('fields.images.label') },
  ] as const);
}
