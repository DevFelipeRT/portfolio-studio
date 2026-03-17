import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { ImageFormData } from '@/modules/images/core/forms';

export function getErrorSummaryFields(
  errors: FormErrors<keyof ImageFormData>,
  t: (key: string) => string,
) {
  return collectErroredFieldLabels(errors, [
    { name: 'file', label: t('fields.file.label') },
    { name: 'image_title', label: t('fields.image_title.label') },
    { name: 'alt_text', label: t('fields.alt_text.label') },
    { name: 'caption', label: t('fields.caption.label') },
  ] as const);
}
