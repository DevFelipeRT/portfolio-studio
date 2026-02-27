import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { InitiativeFormData } from '@/modules/initiatives/core/forms';

export function getErrorSummaryFields(
  errors: FormErrors<keyof InitiativeFormData>,
) {
  return collectErroredFieldLabels(errors, [
    { name: 'locale', label: 'Locale' },
    { name: 'name', label: 'Name' },
    { name: 'start_date', label: 'Date or start date' },
    { name: 'summary', label: 'Summary' },
    { name: 'end_date', label: 'End date' },
    { name: 'description', label: 'Description' },
    { name: 'display', label: 'Display on landing' },
    { name: 'images', label: 'Images' },
  ] as const);
}

