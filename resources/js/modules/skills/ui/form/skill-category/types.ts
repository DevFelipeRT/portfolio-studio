import type { FormErrors } from '@/common/forms';
import type { SkillCategoryFormData } from '@/modules/skills/core/forms';
import type React from 'react';

export interface SkillCategoryFormProps {
  data: SkillCategoryFormData;
  errors: FormErrors<keyof SkillCategoryFormData>;
  processing: boolean;
  onChange(field: keyof SkillCategoryFormData, value: string): void;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  cancelHref: string;
  submitLabel: string;
  deleteHref?: string;
  deleteLabel?: string;
}
