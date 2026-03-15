'use client';

import { canonicalizeLocale } from '@/common/locale';
import type { Locale } from '@/common/locale';
import { useI18nextTranslation } from '../../i18next';

/**
 * Retrieves the currently active locale identifier from the i18n runtime.
 */
export function useGetI18nLocale(): Locale {
  const { i18n } = useI18nextTranslation();

  const resolved = (i18n.resolvedLanguage ?? i18n.language ?? '').trim();
  const canonical = resolved ? canonicalizeLocale(resolved) : null;

  return (canonical ?? 'en') as Locale;
}
