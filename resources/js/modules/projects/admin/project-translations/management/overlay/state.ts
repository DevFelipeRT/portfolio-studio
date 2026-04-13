import type { ProjectTranslationRecord } from '../types';

export function getAvailableLocales(
  supportedLocales: readonly string[],
  translations: readonly ProjectTranslationRecord[],
  baseLocale: string,
): string[] {
  const usedLocales = new Set(translations.map((item) => item.locale));

  return supportedLocales.filter(
    (locale) => locale !== baseLocale && !usedLocales.has(locale),
  );
}

export function findActiveTranslation(
  translations: readonly ProjectTranslationRecord[],
  activeLocale: string | null,
): ProjectTranslationRecord | null {
  if (!activeLocale) {
    return null;
  }

  return translations.find((item) => item.locale === activeLocale) ?? null;
}

export function addTranslation(
  translations: readonly ProjectTranslationRecord[],
  translation: ProjectTranslationRecord,
): ProjectTranslationRecord[] {
  return [...translations, translation];
}

export function replaceTranslation(
  translations: readonly ProjectTranslationRecord[],
  translation: ProjectTranslationRecord,
): ProjectTranslationRecord[] {
  return translations.map((entry) =>
    entry.locale === translation.locale ? translation : entry,
  );
}

export function removeTranslation(
  translations: readonly ProjectTranslationRecord[],
  locale: string,
): ProjectTranslationRecord[] {
  return translations.filter((entry) => entry.locale !== locale);
}
