import type { FormErrors } from '@/common/forms';
import type { InitiativeFormData } from '@/modules/initiatives/core/forms';
import type { InitiativeImage } from '@/modules/initiatives/core/types';
import type React from 'react';

export interface InitiativeFormProps {
  submitLabel: string;
  cancelHref: string;
  initiativeId?: number;
  existingImages: InitiativeImage[];
  data: InitiativeFormData;
  errors: FormErrors<keyof InitiativeFormData>;
  processing: boolean;
  supportedLocales: readonly string[];
  localeDisabled?: boolean;
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
  onChangeField<K extends keyof InitiativeFormData>(
    key: K,
    value: InitiativeFormData[K],
  ): void;
  onChangeLocale?(locale: string): void;
  onAddImageRow(): void;
  onRemoveImageRow(index: number): void;
  onUpdateImageAlt(index: number, value: string): void;
  onUpdateImageFile(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ): void;
}
