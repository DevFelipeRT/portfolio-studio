import type { FormErrors } from '@/common/forms';
import type { WebsiteSettingsFormData } from '@/modules/website-settings/forms';
import type React from 'react';

export interface WebsiteSettingsFormProps {
  data: WebsiteSettingsFormData;
  errors: FormErrors;
  processing: boolean;
  locales: string[];
  cancelHref: string;
  onChange(field: keyof WebsiteSettingsFormData, value: unknown): void;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
}
