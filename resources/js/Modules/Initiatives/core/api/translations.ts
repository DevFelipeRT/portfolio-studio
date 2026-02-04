import type { InitiativeTranslationItem } from '@/Modules/Initiatives/core/types';

type TranslationPayload = {
  locale: string;
  name?: string | null;
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

export async function listInitiativeTranslations(
  initiativeId: number,
): Promise<InitiativeTranslationItem[]> {
  const response = await window.axios.get(
    route('initiatives.translations.index', initiativeId),
  );
  return (response?.data?.data as InitiativeTranslationItem[]) ?? [];
}

export async function createInitiativeTranslation(
  initiativeId: number,
  payload: TranslationPayload,
): Promise<InitiativeTranslationItem> {
  const response = await window.axios.post(
    route('initiatives.translations.store', initiativeId),
    payload,
  );
  return response.data?.data as InitiativeTranslationItem;
}

export async function updateInitiativeTranslation(
  initiativeId: number,
  locale: string,
  payload: TranslationPayload,
): Promise<InitiativeTranslationItem> {
  const response = await window.axios.put(
    route('initiatives.translations.update', { initiative: initiativeId, locale }),
    payload,
  );
  return response.data?.data as InitiativeTranslationItem;
}

export async function deleteInitiativeTranslation(
  initiativeId: number,
  locale: string,
): Promise<void> {
  await window.axios.delete(
    route('initiatives.translations.destroy', { initiative: initiativeId, locale }),
  );
}
