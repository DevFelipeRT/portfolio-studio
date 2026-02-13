import type { CourseTranslationItem } from '@/modules/courses/core/types';

type TranslationPayload = {
  locale: string;
  name?: string | null;
  institution?: string | null;
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

export async function listCourseTranslations(
  courseId: number,
): Promise<CourseTranslationItem[]> {
  const response = await window.axios.get(
    route('courses.translations.index', courseId),
  );
  return (response?.data?.data as CourseTranslationItem[]) ?? [];
}

export async function createCourseTranslation(
  courseId: number,
  payload: TranslationPayload,
): Promise<CourseTranslationItem> {
  const response = await window.axios.post(
    route('courses.translations.store', courseId),
    payload,
  );
  return response.data?.data as CourseTranslationItem;
}

export async function updateCourseTranslation(
  courseId: number,
  locale: string,
  payload: TranslationPayload,
): Promise<CourseTranslationItem> {
  const response = await window.axios.put(
    route('courses.translations.update', { course: courseId, locale }),
    payload,
  );
  return response.data?.data as CourseTranslationItem;
}

export async function deleteCourseTranslation(
  courseId: number,
  locale: string,
): Promise<void> {
  await window.axios.delete(
    route('courses.translations.destroy', { course: courseId, locale }),
  );
}
