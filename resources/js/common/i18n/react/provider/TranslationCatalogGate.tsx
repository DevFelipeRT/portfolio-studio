'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import type { Locale } from '../../core/types';
import { useTranslationCatalogReadiness } from './state/useTranslationCatalogReadiness';
import type { I18nTranslatorProvider } from './types';
import { LoadingOverlay } from './LoadingOverlay';

export type TranslationCatalogGateProps = {
  children: ReactNode;
  locale: Locale;
  fallbackLocale?: Locale | null;
  translatorProvider?: I18nTranslatorProvider;
  loadingFallback?: ReactNode;
  loadingOverlay?: ReactNode;
  loadingOverlayDelayMs?: number;
  strategy?: 'block' | 'keep';
  onReadyLocale?(locale: Locale): void;
};

/**
 * Prevents rendering children until the translation catalog for the current
 * locale has been preloaded.
 */
export function TranslationCatalogGate({
  children,
  locale,
  fallbackLocale = null,
  translatorProvider,
  loadingFallback = null,
  loadingOverlay,
  loadingOverlayDelayMs = 250,
  strategy = 'block',
  onReadyLocale,
}: TranslationCatalogGateProps) {
  const overlayDelay = strategy === 'keep' ? loadingOverlayDelayMs : -1;

  const { isReady, showOverlay, readyLocale } = useTranslationCatalogReadiness({
      locale,
      fallbackLocale,
      translatorProvider,
      loadingOverlayDelayMs: overlayDelay,
    });

  const resolvedReady = isReady && readyLocale === locale;

  const lastNotifiedLocale = useRef<Locale | null>(null);
  const shouldNotify = useMemo(
    () => resolvedReady && typeof onReadyLocale === 'function',
    [resolvedReady, onReadyLocale],
  );

  useEffect(() => {
    if (!shouldNotify) {
      return;
    }

    if (lastNotifiedLocale.current === locale) {
      return;
    }

    lastNotifiedLocale.current = locale;
    onReadyLocale?.(locale);
  }, [shouldNotify, locale, onReadyLocale]);

  if (strategy === 'block') {
    if (!resolvedReady) {
      return <>{loadingFallback}</>;
    }
    return <>{children}</>;
  }

  // strategy === 'keep'
  const overlayContent = loadingOverlay ?? loadingFallback;

  return (
    <>
      {children}
      <LoadingOverlay open={!resolvedReady && showOverlay} content={overlayContent} />
    </>
  );
}
