import type { Locale } from '@/common/locale';
import { getI18next } from './i18next';

/**
 * Returns the shared i18next runtime instance used by the application.
 */
export function getI18nRuntime() {
  return getI18next();
}

/**
 * Changes the active language of the shared i18next runtime.
 */
export async function setI18nRuntimeLocale(locale: Locale | string): Promise<string> {
  const trimmed = String(locale).trim();
  if (!trimmed) {
    return trimmed;
  }

  await getI18nRuntime().changeLanguage(trimmed);
  return trimmed;
}
