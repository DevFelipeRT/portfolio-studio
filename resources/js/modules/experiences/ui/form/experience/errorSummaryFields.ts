import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';

export function getErrorSummaryFields(
  errors: FormErrors<keyof ExperienceFormData>,
  labels: {
    locale: string;
    position: string;
    company: string;
    summary: string;
    description: string;
    start_date: string;
    end_date: string;
    display: string;
  },
) {
  return collectErroredFieldLabels(errors, [
    { name: 'locale', label: labels.locale },
    { name: 'position', label: labels.position },
    { name: 'company', label: labels.company },
    { name: 'summary', label: labels.summary },
    { name: 'description', label: labels.description },
    { name: 'start_date', label: labels.start_date },
    { name: 'end_date', label: labels.end_date },
    { name: 'display', label: labels.display },
  ] as const);
}
