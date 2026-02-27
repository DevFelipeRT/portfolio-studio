import type { FormErrors } from '@/common/forms';
import type { ProjectFormData } from '@/modules/projects/core/forms';
import type { ProjectImage } from '@/modules/projects/core/types';
import type { Skill } from '@/modules/skills/core/types';
import type React from 'react';

export interface ProjectFormProps {
  skills: Skill[];
  existingImages: ProjectImage[];
  data: ProjectFormData;
  errors: FormErrors<keyof ProjectFormData>;
  processing: boolean;
  cancelHref: string;
  submitLabel: string;
  supportedLocales: readonly string[];
  localeDisabled?: boolean;
  projectId?: number;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  onChangeField<K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K],
  ): void;
  onChangeLocale?(locale: string): void;
  onChangeSkillIds(ids: number[]): void;
  onAddImageRow(): void;
  onRemoveImageRow(index: number): void;
  onUpdateImageAlt(index: number, value: string): void;
  onUpdateImageFile(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void;
}
