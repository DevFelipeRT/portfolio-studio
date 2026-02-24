import type { FormErrors } from '@/common/forms';
import type { ImageFormData } from '@/modules/images/core/forms';
import type { Image } from '@/modules/images/core/types';
import type React from 'react';

export type ImageFormMode = 'create' | 'edit';

export interface ImageFormProps {
  mode: ImageFormMode;
  image?: Image;
  data: ImageFormData;
  errors: FormErrors<keyof ImageFormData>;
  processing: boolean;
  cancelHref: string;
  cancelLabel: string;
  submitLabel: string;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  onChange<K extends keyof ImageFormData>(field: K, value: ImageFormData[K]): void;
}

