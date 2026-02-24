import type { FormErrors } from '@/common/forms';
import type { CourseFormData } from '@/modules/courses/core/forms';
import type React from 'react';

export interface CourseFormProps {
  data: CourseFormData;
  errors: FormErrors<keyof CourseFormData>;
  processing: boolean;
  categories: Record<string, string>;
  onChange(key: keyof CourseFormData, value: string | null | boolean): void;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  cancelHref: string;
  onLocaleChange?(locale: string): void;
  localeDisabled?: boolean;
}

