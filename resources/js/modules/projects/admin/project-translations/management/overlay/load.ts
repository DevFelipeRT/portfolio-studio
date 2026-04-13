import {
  fetchSupportedLocales,
  listProjectTranslations,
} from '@/modules/projects/api/translations';
import type { ProjectTranslationRecord } from '../types';

type TranslationOverlayData = {
  supportedLocales: string[];
  translations: ProjectTranslationRecord[];
};

export async function loadTranslationOverlayData(
  projectId: number,
): Promise<TranslationOverlayData> {
  const [supportedLocales, items] = await Promise.all([
    fetchSupportedLocales(),
    listProjectTranslations(projectId),
  ]);

  return {
    supportedLocales,
    translations: items,
  };
}
