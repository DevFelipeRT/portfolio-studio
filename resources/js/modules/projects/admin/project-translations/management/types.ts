import type { ProjectTranslationItem } from '@/modules/projects/types';

export type ProjectTranslationRecord = ProjectTranslationItem;

export type ProjectTranslationFields = {
  name: string;
  summary: string;
  description: string;
};

export type CreateProjectTranslationDraft = ProjectTranslationFields & {
  locale: string;
};

export type EditProjectTranslationDraft = ProjectTranslationFields;
