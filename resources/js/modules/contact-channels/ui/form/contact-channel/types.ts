import type { FormErrors } from '@/common/forms';
import type { ContactChannelFormData } from '@/modules/contact-channels/core/forms';
import type { ContactChannelTypeOption } from '@/modules/contact-channels/core/types';
import type React from 'react';

export interface ContactChannelFormProps {
  data: ContactChannelFormData;
  errors: FormErrors<keyof ContactChannelFormData>;
  channelTypes: ContactChannelTypeOption[];
  processing: boolean;
  onChange(
    field: keyof ContactChannelFormData,
    value: string | number | boolean | '',
  ): void;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  cancelHref: string;
  submitLabel: string;
  deleteHref?: string;
  deleteLabel?: string;
}
