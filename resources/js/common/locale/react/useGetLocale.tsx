'use client';

import { useI18nextTranslation } from '@/common/i18n/i18next';
import { canonicalizeLocale } from '../canonicalizers/localeCanonicalizer';
import type { Locale } from '../types';

/**
 * Retrieves the currently active locale identifier from i18next.
 */
export function useGetLocale(): Locale {
  const { i18n } = useI18nextTranslation();

  const resolved = (i18n.resolvedLanguage ?? i18n.language ?? '').trim();
  const canonical = resolved ? canonicalizeLocale(resolved) : null;

  return (canonical ?? 'en') as Locale;
}
