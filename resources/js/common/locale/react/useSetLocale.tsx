'use client';

import { useCallback, useEffect, useRef } from 'react';
import { createLocaleResolver } from '../localeResolver';
import type { Locale } from '../types';
import { persistLocale } from './set-locale/persistence';
import { scheduleReload as scheduleLocaleReload } from './set-locale/reloadScheduler';
import { useGetLocale } from './useGetLocale';
import { useSupportedLocales } from './useSupportedLocales';

export type UseSetLocaleOptions = {
  cookieName?: string;
  maxAgeDays?: number;
  apiEndpoint?: string;
  persistClientCookie?: boolean;
  reload?(pathname: string): void;
  applyLocaleState?: boolean;
  reloadDelayMs?: number;
  preloadLocale?(locale: string): Promise<void>;
  applyResolvedLocale?(locale: string): Promise<void>;
};

export type SetLocaleHandler = (nextLocale: string) => Promise<string>;

/**
 * Resolves, persists, and optionally applies a locale change.
 */
export function useSetLocale(options?: UseSetLocaleOptions): SetLocaleHandler {
  const supportedLocales = useSupportedLocales();
  const currentLocale = useGetLocale();

  const localeResolver = createLocaleResolver({
    supportedLocales,
    defaultLocale: currentLocale,
  });

  const cookieName = options?.cookieName ?? 'locale';
  const maxAgeDays = options?.maxAgeDays ?? 30;
  const apiEndpoint = options?.apiEndpoint ?? '/set-locale';
  const persistClientCookie = options?.persistClientCookie ?? true;
  const reload = options?.reload;
  const reloadDelayMs = options?.reloadDelayMs ?? 400;
  const applyLocaleState = options?.applyLocaleState ?? (reloadDelayMs < 0);
  const preloadLocale = options?.preloadLocale;
  const applyResolvedLocale = options?.applyResolvedLocale;

  const reloadTimerId = useRef<number | null>(null);
  const lastRequestedLocale = useRef<string | null>(null);
  const lastPersistPromise = useRef<Promise<unknown> | null>(null);
  const cancelReloadRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      cancelReloadRef.current = null;
    };
  }, []);

  const resolveLocaleForPersistence = useCallback(
    (nextLocale: string): string => {
      const trimmed = nextLocale.trim();
      if (!trimmed) {
        return trimmed;
      }

      return localeResolver.resolve(trimmed as Locale);
    },
    [localeResolver],
  );

  const persistResolvedLocale = useCallback(
    (resolvedLocale: string): Promise<unknown> => {
      return persistLocale(resolvedLocale, {
        apiEndpoint,
        cookieName,
        maxAgeDays,
        persistClientCookie,
      });
    },
    [apiEndpoint, cookieName, maxAgeDays, persistClientCookie],
  );

  const scheduleReload = useCallback(
    (resolvedLocale: string): void => {
      cancelReloadRef.current = scheduleLocaleReload({
        reloadTimerId,
        lastRequestedLocale,
        lastPersistPromise,
        reloadDelayMs,
        resolvedLocale,
        reload,
      });
    },
    [reload, reloadDelayMs],
  );

  const handler: SetLocaleHandler = useCallback(
    async (nextLocale: string) => {
      const resolved = resolveLocaleForPersistence(nextLocale);
      lastRequestedLocale.current = resolved;

      const preloadPromise = preloadLocale
        ? preloadLocale(resolved)
        : Promise.resolve();

      if (applyLocaleState && applyResolvedLocale) {
        await preloadPromise;
        if (lastRequestedLocale.current === resolved) {
          await applyResolvedLocale(resolved);
        }
      }

      lastPersistPromise.current = Promise.all([
        persistResolvedLocale(resolved),
        preloadPromise,
      ]);

      scheduleReload(resolved);

      return resolved;
    },
    [
      applyLocaleState,
      applyResolvedLocale,
      persistResolvedLocale,
      preloadLocale,
      resolveLocaleForPersistence,
      scheduleReload,
    ],
  );

  return handler;
}
