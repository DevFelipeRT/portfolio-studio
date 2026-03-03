'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '../../../core/types';
import type { I18nTranslatorProvider } from '../types';

export type UseTranslationCatalogReadinessOptions = {
  locale: Locale;
  fallbackLocale?: Locale | null;
  translatorProvider?: I18nTranslatorProvider;
  loadingOverlayDelayMs?: number;
};

export type UseTranslationCatalogReadinessResult = {
  isReady: boolean;
  hasLoadedOnce: boolean;
  showOverlay: boolean;
  readyLocale: Locale | null;
};

/**
 * Preloads translation catalogs for a locale (and optional fallback locale)
 * and exposes readiness for safe rendering/translation.
 */
export function useTranslationCatalogReadiness({
  locale,
  fallbackLocale = null,
  translatorProvider,
  loadingOverlayDelayMs = 250,
}: UseTranslationCatalogReadinessOptions): UseTranslationCatalogReadinessResult {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [readyLocale, setReadyLocale] = useState<Locale | null>(null);
  const loadSequence = useRef<number>(0);

  const preloadLocale = useMemo(() => {
    const preloadLocaleFn = translatorProvider?.preloadLocale;
    return typeof preloadLocaleFn === 'function' ? preloadLocaleFn : null;
  }, [translatorProvider]);

  useEffect(() => {
    let cancelled = false;

    if (!preloadLocale) {
      setReadyLocale(locale);
      setIsReady(true);
      setHasLoadedOnce(true);
      setShowOverlay(false);
      return;
    }
    const preload = preloadLocale;

    const sequence = ++loadSequence.current;
    const isCurrent = () => !cancelled && loadSequence.current === sequence;

    async function run() {
      setIsReady(false);
      setShowOverlay(false);

      const overlayTimer: number | null =
        hasLoadedOnce && loadingOverlayDelayMs >= 0
          ? window.setTimeout(() => {
              if (isCurrent()) {
                setShowOverlay(true);
              }
            }, loadingOverlayDelayMs)
          : null;

      try {
        await preload(locale);
        if (fallbackLocale && fallbackLocale !== locale) {
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

      setReadyLocale(locale);
      setIsReady(true);
      setHasLoadedOnce(true);
      setShowOverlay(false);
    }

    run();

    return () => {
      cancelled = true;
      setShowOverlay(false);
    };
  }, [locale, fallbackLocale, preloadLocale, hasLoadedOnce, loadingOverlayDelayMs]);

  return {
    isReady,
    hasLoadedOnce,
    showOverlay,
    readyLocale,
  };
}
