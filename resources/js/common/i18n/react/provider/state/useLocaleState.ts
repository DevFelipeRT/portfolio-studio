'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import type { LocaleResolver } from '../../../core/locale';
import type { Locale } from '../../../core/types';

export type UseLocaleStateOptions = {
  initialLocale: string | null;
  localeResolver: LocaleResolver;
};

export type UseLocaleStateResult = {
  activeLocale: Locale;
  activeLocaleRef: MutableRefObject<Locale>;
  requestedLocale: Locale | null;
  requestLocale(nextLocale: string): Locale;
  commitRequestedLocale(): void;
  clearRequestedLocale(): void;
};

/**
 * Tracks active and requested locale state based on `initialLocale` changes and
 * explicit locale requests.
 */
export function useLocaleState({
  initialLocale,
  localeResolver,
}: UseLocaleStateOptions): UseLocaleStateResult {
  const resolvedInitial: Locale = useMemo(() => {
    return localeResolver.resolve(initialLocale ?? localeResolver.defaultLocale);
  }, [initialLocale, localeResolver]);

  const [activeLocale, setActiveLocale] = useState<Locale>(resolvedInitial);
  const activeLocaleRef = useRef<Locale>(activeLocale);
  const [requestedLocale, setRequestedLocale] = useState<Locale | null>(null);

  useEffect(() => {
    activeLocaleRef.current = activeLocale;
  }, [activeLocale]);

  useEffect(() => {
    const resolved = localeResolver.resolve(
      initialLocale ?? localeResolver.defaultLocale,
    );

    if (resolved !== activeLocaleRef.current) {
      setRequestedLocale(resolved);
    }
  }, [initialLocale, localeResolver, activeLocaleRef]);

  const requestLocale = useCallback(
    (nextLocale: string): Locale => {
      const resolved = localeResolver.resolve(nextLocale as Locale);
      if (resolved !== activeLocale) {
        setRequestedLocale(resolved);
      }
      return resolved;
    },
    [activeLocale, localeResolver],
  );

  const commitRequestedLocale = useCallback(() => {
    setActiveLocale((current) => {
      if (!requestedLocale || requestedLocale === current) {
        return current;
      }
      return requestedLocale;
    });
  }, [requestedLocale]);

  const clearRequestedLocale = useCallback(() => {
    setRequestedLocale(null);
  }, []);

  return {
    activeLocale,
    activeLocaleRef,
    requestedLocale,
    requestLocale,
    commitRequestedLocale,
    clearRequestedLocale,
  };
}
