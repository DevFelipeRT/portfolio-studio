'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '../../../core/types';
import type { I18nTranslatorProvider } from '../types';
import type { PreloadLocale } from './types';

export type UseCatalogPreloadOptions = {
  targetLocale: Locale;
  fallbackLocale: Locale | null;
  translatorProvider?: I18nTranslatorProvider;
  loadingOverlayDelayMs: number;
};

export type UseCatalogPreloadResult = {
  isCatalogReady: boolean;
  hasLoadedOnce: boolean;
  showOverlay: boolean;
  readyLocale: Locale | null;
};

/**
 * Tracks catalog preload state for a target locale. When a preload function is
 * available, it starts a preload attempt for the target locale and an optional
 * fallback locale. It reports readiness, one-time load status, delayed overlay
 * visibility, and the locale associated with the latest completed attempt.
 */
export function useCatalogPreload({
  targetLocale,
  fallbackLocale,
  translatorProvider,
  loadingOverlayDelayMs,
}: UseCatalogPreloadOptions): UseCatalogPreloadResult {
  const [isCatalogReady, setIsCatalogReady] = useState<boolean>(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [readyLocale, setReadyLocale] = useState<Locale | null>(null);
  const loadSequence = useRef<number>(0);

  const preloadLocale: PreloadLocale | null = useMemo(() => {
    const preloadLocaleFn = translatorProvider?.preloadLocale;
    return typeof preloadLocaleFn === 'function' ? preloadLocaleFn : null;
  }, [translatorProvider]);

  useEffect(() => {
    let cancelled = false;

    if (!preloadLocale) {
      setShowOverlay(false);
      setHasLoadedOnce(true);
      setIsCatalogReady(true);
      setReadyLocale(targetLocale);
      return;
    }
    const preload = preloadLocale;

    const sequence = ++loadSequence.current;
    const isCurrent = () => !cancelled && loadSequence.current === sequence;

    async function run() {
      setIsCatalogReady(false);

      const overlayTimer: number | null =
        hasLoadedOnce && loadingOverlayDelayMs >= 0
          ? window.setTimeout(() => {
              if (isCurrent()) {
                setShowOverlay(true);
              }
            }, loadingOverlayDelayMs)
          : null;

      try {
        await preload(targetLocale);
        if (fallbackLocale && fallbackLocale !== targetLocale) {
          await preload(fallbackLocale);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.warn('[i18n] Failed to preload catalogs.', error);
        }
      } finally {
        if (overlayTimer !== null) {
          window.clearTimeout(overlayTimer);
        }
      }

      if (!isCurrent()) {
        return;
      }

      setShowOverlay(false);
      setHasLoadedOnce(true);
      setIsCatalogReady(true);
      setReadyLocale(targetLocale);
    }

    run();

    return () => {
      cancelled = true;
      setShowOverlay(false);
    };
  }, [targetLocale, fallbackLocale, preloadLocale, hasLoadedOnce, loadingOverlayDelayMs]);

  return {
    isCatalogReady,
    hasLoadedOnce,
    showOverlay,
    readyLocale,
  };
}
