import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';

export function getErrorSummaryFields(
  errors: FormErrors<keyof ExperienceFormData>,
  localeLabel: string,
) {
  return collectErroredFieldLabels(errors, [
    { name: 'locale', label: localeLabel },
    { name: 'position', label: 'Position' },
    { name: 'company', label: 'Company' },
    { name: 'summary', label: 'Summary' },
    { name: 'description', label: 'Description' },
    { name: 'start_date', label: 'Start date' },
    { name: 'end_date', label: 'End date' },
    { name: 'display', label: 'Display on portfolio' },
  ] as const);
}

