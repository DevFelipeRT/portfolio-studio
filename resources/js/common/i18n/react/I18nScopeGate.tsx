import { resolveInertiaLocalizationContext } from '@/app/inertia';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { canonicalizeLocale, useGetLocale } from '@/common/locale';
import type { Locale } from '@/common/locale';
import { usePage } from '@inertiajs/react';
import type { InertiaPageProps } from '@/app/inertia';
import { preloaderForI18nScopes } from '../preloading';

export type I18nScopeGateProps = {
  scopeIds?: readonly string[] | null;
  children: ReactNode;
  loadingFallback?: ReactNode;
  fallbackLocale?: Locale | null;
  keepPreviousContentDuringLoad?: boolean;
  /**
   * Wait this long before showing the loading UI.
   * If loading finishes before this threshold, no loading UI is rendered.
   */
  loadingDelayMs?: number;
  /**
   * Minimum time to keep the loading UI visible once it appears.
   */
  loadingMinVisibleMs?: number;
  /**
   * Backward-compatible alias for `loadingDelayMs`.
   */
  appearDelayMs?: number;
  /**
   * Backward-compatible alias for `loadingMinVisibleMs`.
   */
  minVisibleMs?: number;
};

function normalizeScope(scope?: readonly string[] | null): string[] {
  if (!scope) return [];

  const seen = new Set<string>();
  const ids: string[] = [];
  scope.forEach((id) => {
    if (typeof id !== 'string') return;
    const key = id.trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    ids.push(key);
  });

  return ids;
}

/**
 * Blocks rendering until all scoped i18n preloaders have preloaded bundles for
 * the current locale (and optional fallback locale).
 *
 * Use this around dynamic pages/features (e.g. CMS sections) to prevent
 * translating before scoped bundles are ready.
 */
export function I18nScopeGate({
  scopeIds,
  children,
  loadingFallback = null,
  fallbackLocale: explicitFallbackLocale = null,
  keepPreviousContentDuringLoad = true,
  loadingDelayMs,
  loadingMinVisibleMs,
  appearDelayMs,
  minVisibleMs,
}: I18nScopeGateProps) {
  const locale = useGetLocale();
  const pageProps = usePage().props as InertiaPageProps;
  const localizationContext = resolveInertiaLocalizationContext(pageProps);

  const fallbackLocale: Locale | null =
    canonicalizeLocale(
      explicitFallbackLocale ?? localizationContext.fallbackLocale ?? '',
    );

  const normalizedScope = useMemo(
    () => normalizeScope(scopeIds),
    [scopeIds],
  );
  const resolvedLoadingDelayMs = loadingDelayMs ?? appearDelayMs ?? 150;
  const resolvedLoadingMinVisibleMs =
    loadingMinVisibleMs ?? minVisibleMs ?? 250;

  const [isReady, setIsReady] = useState<boolean>(normalizedScope.length === 0);
  const sequence = useRef<number>(0);
  const [showFallback, setShowFallback] = useState<boolean>(false);
  const fallbackVisibleSince = useRef<number | null>(null);
  const appearTimerId = useRef<number | null>(null);
  const minVisibleTimerId = useRef<number | null>(null);
  const lastReadyChildrenRef = useRef<ReactNode>(children);

  const preloader = useMemo(() => {
    if (normalizedScope.length === 0) {
      return null;
    }
    return preloaderForI18nScopes(normalizedScope);
  }, [normalizedScope]);

  useEffect(() => {
    if (!preloader) {
      setIsReady(true);
      return;
    }

    const activePreloader = preloader;
    let cancelled = false;
    const current = ++sequence.current;

    async function run() {
      setIsReady(false);

      await activePreloader.preloadLocale?.(locale);
      if (fallbackLocale && fallbackLocale !== locale) {
        await activePreloader.preloadLocale?.(fallbackLocale);
      }

      if (cancelled) return;
      if (sequence.current !== current) return;
      setIsReady(true);
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [preloader, locale, fallbackLocale]);

  useEffect(() => {
    if (appearTimerId.current !== null) {
      window.clearTimeout(appearTimerId.current);
      appearTimerId.current = null;
    }
    if (minVisibleTimerId.current !== null) {
      window.clearTimeout(minVisibleTimerId.current);
      minVisibleTimerId.current = null;
    }

    if (!isReady) {
      fallbackVisibleSince.current = null;
      setShowFallback(false);

      if (!loadingFallback) {
        return;
      }

      if (resolvedLoadingDelayMs <= 0) {
        fallbackVisibleSince.current = Date.now();
        setShowFallback(true);
        return;
      }

      appearTimerId.current = window.setTimeout(() => {
        fallbackVisibleSince.current = Date.now();
        setShowFallback(true);
      }, resolvedLoadingDelayMs);

      return;
    }

    if (!showFallback) {
      fallbackVisibleSince.current = null;
      return;
    }

    const since = fallbackVisibleSince.current;
    if (!since || resolvedLoadingMinVisibleMs <= 0) {
      fallbackVisibleSince.current = null;
      setShowFallback(false);
      return;
    }

    const elapsed = Date.now() - since;
    const remaining = resolvedLoadingMinVisibleMs - elapsed;

    if (remaining <= 0) {
      fallbackVisibleSince.current = null;
      setShowFallback(false);
      return;
    }

    minVisibleTimerId.current = window.setTimeout(() => {
      fallbackVisibleSince.current = null;
      setShowFallback(false);
    }, remaining);
  }, [
    isReady,
    loadingFallback,
    resolvedLoadingDelayMs,
    resolvedLoadingMinVisibleMs,
    showFallback,
  ]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    lastReadyChildrenRef.current = children;
  }, [children, isReady]);

  if (showFallback) {
    return <>{loadingFallback}</>;
  }

  if (!isReady) {
    if (keepPreviousContentDuringLoad) {
      return <>{lastReadyChildrenRef.current}</>;
    }

    return null;
  }

  return <>{children}</>;
}
