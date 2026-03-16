'use client';

import { useAppLocalizationContext } from '@/app/shell';
import { useMemo } from 'react';
import { canonicalizeLocale } from '../canonicalizers/localeCanonicalizer';
import type { Locale } from '../types';
import { useGetLocale } from './useGetLocale';

/**
 * Retrieves the list of supported locales from Inertia shared props.
 */
export function useSupportedLocales(): readonly Locale[] {
  const activeLocale = useGetLocale();
  const { supportedLocales: raw } = useAppLocalizationContext();

  return useMemo(() => {
    const list = Array.isArray(raw) ? raw : [];
    const canonical = list
      .filter((value): value is string => typeof value === 'string')
      .map((value) => canonicalizeLocale(value.trim()))
      .filter((value): value is Locale => value !== null);

    if (!canonical.includes(activeLocale)) {
      canonical.push(activeLocale);
    }

    return Object.freeze(Array.from(new Set<Locale>(canonical)));
  }, [raw, activeLocale]);
}
