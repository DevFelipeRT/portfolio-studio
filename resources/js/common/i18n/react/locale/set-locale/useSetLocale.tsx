'use client';

import { useCallback, useContext, useEffect, useRef } from 'react';
import { I18nContext } from '../../I18nContext';
import { persistLocale } from './persistence';
import { scheduleReload as scheduleInertiaReload } from './reloadScheduler';

export type UseSetLocaleOptions = {
  cookieName?: string;
  maxAgeDays?: number;
  apiEndpoint?: string;
  persistClientCookie?: boolean;
  reload?(pathname: string): void;
  /**
   * Delay before reloading the current Inertia route.
   * - `0`: reload immediately
   * - `> 0`: reload after delay (only the last selection)
   * - `< 0`: disable reload (still persists cookie/API)
   */
  reloadDelayMs?: number;
};

export type SetLocaleHandler = (nextLocale: string) => Promise<string>;

/**
 * Requests a locale change through the i18n context, persists the resolved
 * locale, and optionally schedules a page reload.
 */
export function useSetLocale(options?: UseSetLocaleOptions): SetLocaleHandler {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useSetLocale must be used within an I18nProvider.');
  }

  const { setLocale } = context;

  const cookieName = options?.cookieName ?? 'locale';
  const maxAgeDays = options?.maxAgeDays ?? 30;
  const apiEndpoint = options?.apiEndpoint ?? '/set-locale';
  const persistClientCookie = options?.persistClientCookie ?? true;
  const reload = options?.reload;
  const reloadDelayMs = options?.reloadDelayMs ?? 400;

  // Stores state for the debounced reload.
  const reloadTimerId = useRef<number | null>(null);
  const lastRequestedLocale = useRef<string | null>(null);
  const lastPersistPromise = useRef<Promise<unknown> | null>(null);
  const cancelReloadRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      cancelReloadRef.current?.();
      cancelReloadRef.current = null;
    };
  }, []);

  const applyLocaleState = useCallback(
    (nextLocale: string): string => {
      const resolved = setLocale(nextLocale);
      lastRequestedLocale.current = resolved;
      return resolved;
    },
    [setLocale],
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
      cancelReloadRef.current = scheduleInertiaReload({
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
      // State
      const resolved = applyLocaleState(nextLocale);

      // Persistence
      lastPersistPromise.current = persistResolvedLocale(resolved);

      // Inertia
      scheduleReload(resolved);

      return resolved;
    },
    [applyLocaleState, persistResolvedLocale, scheduleReload],
  );

  return handler;
}
