import type { ExperienceTranslationItem } from '@/Modules/Experiences/core/types';

type TranslationPayload = {
  locale: string;
  position?: string | null;
  company?: string | null;
  summary?: string | null;
  description?: string | null;
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

export async function listExperienceTranslations(
  experienceId: number,
): Promise<ExperienceTranslationItem[]> {
  const response = await window.axios.get(
    route('experiences.translations.index', experienceId),
  );
  return (response?.data?.data as ExperienceTranslationItem[]) ?? [];
}

export async function createExperienceTranslation(
  experienceId: number,
  payload: TranslationPayload,
): Promise<ExperienceTranslationItem> {
  const response = await window.axios.post(
    route('experiences.translations.store', experienceId),
    payload,
  );
  return response.data?.data as ExperienceTranslationItem;
}

export async function updateExperienceTranslation(
  experienceId: number,
  locale: string,
  payload: TranslationPayload,
): Promise<ExperienceTranslationItem> {
  const response = await window.axios.put(
    route('experiences.translations.update', { experience: experienceId, locale }),
    payload,
  );
  return response.data?.data as ExperienceTranslationItem;
}

export async function deleteExperienceTranslation(
  experienceId: number,
  locale: string,
): Promise<void> {
  await window.axios.delete(
    route('experiences.translations.destroy', { experience: experienceId, locale }),
  );
}
