import type { TranslationItem } from '@/Modules/Skills/core/types';

type TranslationPayload = {
  locale: string;
  name: string;
};

function ensureArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

export async function fetchSupportedLocales(): Promise<string[]> {
  const response = await window.axios.get(route('website-settings.locales'));
  return ensureArray(response?.data?.data);
}

export async function listSkillTranslations(
  skillId: number,
): Promise<TranslationItem[]> {
  const response = await window.axios.get(
    route('skills.translations.index', skillId),
  );
  return (response?.data?.data as TranslationItem[]) ?? [];
}

export async function createSkillTranslation(
  skillId: number,
  payload: TranslationPayload,
): Promise<TranslationItem> {
  const response = await window.axios.post(
    route('skills.translations.store', skillId),
    payload,
  );
  return response.data?.data as TranslationItem;
}

export async function updateSkillTranslation(
  skillId: number,
  locale: string,
  payload: TranslationPayload,
): Promise<TranslationItem> {
  const response = await window.axios.put(
    route('skills.translations.update', { skill: skillId, locale }),
    payload,
  );
  return response.data?.data as TranslationItem;
}

export async function deleteSkillTranslation(
  skillId: number,
  locale: string,
): Promise<void> {
  await window.axios.delete(
    route('skills.translations.destroy', { skill: skillId, locale }),
  );
}

export async function listSkillCategoryTranslations(
  categoryId: number,
): Promise<TranslationItem[]> {
  const response = await window.axios.get(
    route('skill-categories.translations.index', { skillCategory: categoryId }),
  );
  return (response?.data?.data as TranslationItem[]) ?? [];
}

export async function createSkillCategoryTranslation(
  categoryId: number,
  payload: TranslationPayload,
): Promise<TranslationItem> {
  const response = await window.axios.post(
    route('skill-categories.translations.store', { skillCategory: categoryId }),
    payload,
  );
  return response.data?.data as TranslationItem;
}

export async function updateSkillCategoryTranslation(
  categoryId: number,
  locale: string,
  payload: TranslationPayload,
): Promise<TranslationItem> {
  const response = await window.axios.put(
    route('skill-categories.translations.update', {
      skillCategory: categoryId,
      locale,
    }),
    payload,
  );
  return response.data?.data as TranslationItem;
}

export async function deleteSkillCategoryTranslation(
  categoryId: number,
  locale: string,
): Promise<void> {
  await window.axios.delete(
    route('skill-categories.translations.destroy', {
      skillCategory: categoryId,
      locale,
    }),
  );
}
