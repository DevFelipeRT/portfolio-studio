'use client';

import { useCallback, useEffect, useMemo } from 'react';
import type { Locale } from '../../../core/types';
import { useLocaleState } from './useLocaleState';
import type {
  UseI18nProviderStateOptions,
  UseI18nProviderStateResult,
} from './types';
import { useCatalogPreload } from './useCatalogPreload';

/**
 * Derives provider-facing locale and loading state by combining locale state
 * with catalog preload state. A requested locale is committed after the
 * corresponding preload attempt reports completion for the current target.
 */
export function useI18nProviderState({
  initialLocale,
  fallbackLocale,
  localeResolver,
  translatorProvider,
  loadingOverlayDelayMs,
}: UseI18nProviderStateOptions): UseI18nProviderStateResult {
  const {
    activeLocale,
    requestedLocale,
    requestLocale,
    commitRequestedLocale,
    clearRequestedLocale,
  } = useLocaleState({ initialLocale, localeResolver });

  const resolvedFallbackLocale = useMemo(() => {
    if (!fallbackLocale) {
      return null;
    }
    return localeResolver.resolve(fallbackLocale);
  }, [fallbackLocale, localeResolver]);

  const targetLocale = requestedLocale ?? activeLocale;

  const { isCatalogReady, hasLoadedOnce, showOverlay, readyLocale } =
    useCatalogPreload({
      targetLocale,
      fallbackLocale: resolvedFallbackLocale,
      translatorProvider,
      loadingOverlayDelayMs,
    });

  useEffect(() => {
    if (!requestedLocale) {
      return;
    }

    if (!isCatalogReady) {
      return;
    }

    if (readyLocale !== targetLocale) {
      return;
    }

    commitRequestedLocale();
    clearRequestedLocale();
  }, [
    requestedLocale,
    isCatalogReady,
    readyLocale,
    targetLocale,
    commitRequestedLocale,
    clearRequestedLocale,
  ]);

  const setLocale = useCallback(
    (nextLocale: string): Locale => requestLocale(nextLocale),
    [requestLocale],
  );

  return {
    activeLocale,
    supportedLocales: localeResolver.supportedLocales,
    isCatalogReady,
    hasLoadedOnce,
    showOverlay,
    setLocale,
  };
}
