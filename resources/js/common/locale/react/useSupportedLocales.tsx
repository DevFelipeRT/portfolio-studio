'use client';

import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { canonicalizeLocale } from '../canonicalizers/localeCanonicalizer';
import type { Locale } from '../types';
import { useGetLocale } from './useGetLocale';

/**
 * Retrieves the list of supported locales from Inertia shared props.
 */
export function useSupportedLocales(): readonly Locale[] {
  const activeLocale = useGetLocale();
  const props = usePage().props as {
    localization?: { supportedLocales?: unknown };
  };

  const raw = props.localization?.supportedLocales;

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
