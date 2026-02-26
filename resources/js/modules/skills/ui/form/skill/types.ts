import type { FormErrors } from '@/common/forms';
import type { SkillFormData } from '@/modules/skills/core/forms';
import type { SkillCategory } from '@/modules/skills/core/types';
import type React from 'react';

export interface SkillFormProps {
  data: SkillFormData;
  errors: FormErrors<keyof SkillFormData>;
  categories: SkillCategory[];
  processing: boolean;
  onChange(field: keyof SkillFormData, value: string | number | ''): void;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  cancelHref: string;
  submitLabel: string;
  deleteHref?: string;
  deleteLabel?: string;
}
