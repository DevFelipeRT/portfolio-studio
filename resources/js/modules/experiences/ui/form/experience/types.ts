import type { FormErrors } from '@/common/forms';
import type { ExperienceFormData } from '@/modules/experiences/core/forms';
import type React from 'react';

export type ExperienceEditableField =
  | 'locale'
  | 'position'
  | 'company'
  | 'summary'
  | 'description'
  | 'start_date'
  | 'end_date'
  | 'display';

export interface ExperienceFormProps {
  data: ExperienceFormData;
  errors: FormErrors<keyof ExperienceFormData>;
  processing: boolean;
  supportedLocales: readonly string[];
  cancelHref: string;
  submitLabel: string;
  localeDisabled?: boolean;
  localeNote?: string | null;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  onChange<K extends ExperienceEditableField>(
    field: K,
    value: ExperienceFormData[K],
  ): void;
  onLocaleChange?(locale: string): void;
}

