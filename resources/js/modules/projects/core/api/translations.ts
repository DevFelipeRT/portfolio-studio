import type { ProjectTranslationItem } from '@/modules/projects/core/types';

type TranslationPayload = {
  locale: string;
  name?: string | null;
  summary?: string | null;
  description?: string | null;
  status?: string | null;
  repository_url?: string | null;
  live_url?: string | null;
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

export async function listProjectTranslations(
  projectId: number,
): Promise<ProjectTranslationItem[]> {
  const response = await window.axios.get(
    route('projects.translations.index', projectId),
  );
  return (response?.data?.data as ProjectTranslationItem[]) ?? [];
}

export async function createProjectTranslation(
  projectId: number,
  payload: TranslationPayload,
): Promise<ProjectTranslationItem> {
  const response = await window.axios.post(
    route('projects.translations.store', projectId),
    payload,
  );
  return response.data?.data as ProjectTranslationItem;
}

export async function updateProjectTranslation(
  projectId: number,
  locale: string,
  payload: TranslationPayload,
): Promise<ProjectTranslationItem> {
  const response = await window.axios.put(
    route('projects.translations.update', { project: projectId, locale }),
    payload,
  );
  return response.data?.data as ProjectTranslationItem;
}

export async function deleteProjectTranslation(
  projectId: number,
  locale: string,
): Promise<void> {
  await window.axios.delete(
    route('projects.translations.destroy', { project: projectId, locale }),
  );
}
