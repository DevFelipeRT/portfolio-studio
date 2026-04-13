import type {
  EditProjectTranslationDraft,
  ProjectTranslationRecord,
} from '../types';

export function toEditProjectTranslationDraft(
  translation: ProjectTranslationRecord,
): EditProjectTranslationDraft {
  return {
    name: translation.name ?? '',
    summary: translation.summary ?? '',
    description: translation.description ?? '',
  };
}
