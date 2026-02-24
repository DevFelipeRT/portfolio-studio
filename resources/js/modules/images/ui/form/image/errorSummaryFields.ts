import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { ImageFormData } from '@/modules/images/core/forms';

export function getErrorSummaryFields(errors: FormErrors<keyof ImageFormData>) {
  return collectErroredFieldLabels(errors, [
    { name: 'file', label: 'File' },
    { name: 'image_title', label: 'Title' },
    { name: 'alt_text', label: 'Alt text' },
    { name: 'caption', label: 'Caption' },
  ] as const);
}

