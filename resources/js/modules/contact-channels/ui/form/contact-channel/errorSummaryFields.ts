import { collectErroredFieldLabels, type FormErrors } from '@/common/forms';
import type { ContactChannelFormData } from '@/modules/contact-channels/core/forms';

export function getErrorSummaryFields(
  errors: FormErrors<keyof ContactChannelFormData>,
) {
  return collectErroredFieldLabels(errors, [
    { name: 'locale', label: 'Locale' },
    { name: 'channel_type', label: 'Type' },
    { name: 'label', label: 'Label' },
    { name: 'value', label: 'Value' },
    { name: 'sort_order', label: 'Order' },
    { name: 'is_active', label: 'Active' },
  ] as const);
}

