import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { ContactChannelFormData } from '@/modules/contact-channels/core/forms';

export function getErrorSummaryFields(
  errors: FormErrors<keyof ContactChannelFormData>,
  t: (key: string) => string,
) {
  return collectErroredFieldLabels(errors, [
    { name: 'locale', label: t('fields.locale.label') },
    { name: 'channel_type', label: t('fields.channel_type.label') },
    { name: 'label', label: t('fields.label.label') },
    { name: 'value', label: t('fields.value.label') },
    { name: 'sort_order', label: t('fields.sort_order.label') },
    { name: 'is_active', label: t('fields.is_active.label') },
  ] as const);
}
