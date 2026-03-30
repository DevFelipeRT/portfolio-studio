import type { FormErrors } from '@/common/forms';
import type { SkillFormData } from '@/modules/skills/core/forms';
import type { AdminSkillCategoryRecord } from '@/modules/skills/core/types';
import type React from 'react';

export interface SkillFormProps {
  data: SkillFormData;
  errors: FormErrors<keyof SkillFormData>;
  categories: AdminSkillCategoryRecord[];
  processing: boolean;
  onChange(field: keyof SkillFormData, value: string | number | ''): void;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  cancelHref: string;
  submitLabel: string;
  deleteHref?: string;
  deleteLabel?: string;
}
