'use client';

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LocaleResolver } from '../core/localeResolver';
import type { TranslationResolver } from '../core/translationResolver';
import type { Locale, Namespace, TranslationParams } from '../core/types';
import { I18nContext } from './I18nContext';

type I18nProviderProps = {
    children: ReactNode;
    initialLocale: string | null;
    localeResolver: LocaleResolver;
    translationResolver: TranslationResolver;
    fallbackLocale?: string | null;
    catalogProvider?: {
        preloadLocale?(locale: Locale): Promise<void>;
    };
    loadingFallback?: ReactNode;
    loadingOverlay?: ReactNode;
    loadingOverlayDelayMs?: number;
};

/**
 * I18nProvider exposes locale + translate functions through a React context.
 *
 * Behavior:
 * - Locale changes are applied after the target locale catalogs are loaded.
 * - The first load renders `loadingFallback` while catalogs load.
 * - Subsequent locale switches keep rendering the current UI and can show an
 *   overlay after `loadingOverlayDelayMs`.
 */
export function I18nProvider({
    children,
    initialLocale,
    localeResolver,
    translationResolver,
    fallbackLocale = null,
    catalogProvider,
    loadingFallback = null,
    loadingOverlay = null,
    loadingOverlayDelayMs = 250,
}: I18nProviderProps) {
    const resolvedInitial: Locale = localeResolver.resolve(
        initialLocale ?? localeResolver.defaultLocale,
    );

    const [activeLocale, setActiveLocale] = useState<Locale>(resolvedInitial);
    // Locale requested by UI or props, applied after catalogs are loaded.
    const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);
    const [isCatalogReady, setIsCatalogReady] = useState<boolean>(false);
    // True after the first successful catalog preload.
    const [hasLoadedOnce, setHasLoadedOnce] = useState<boolean>(false);
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    // Increments per load to ignore stale async completions.
    const loadSequence = useRef<number>(0);

    const resolvedFallbackLocale = useMemo(() => {
        if (!fallbackLocale) {
            return null;
        }
        return localeResolver.resolve(fallbackLocale);
    }, [fallbackLocale, localeResolver]);

    // Synchronizes from `initialLocale` when the prop changes.
    useEffect(() => {
        const resolved = localeResolver.resolve(
            initialLocale ?? localeResolver.defaultLocale,
        );

        if (resolved !== activeLocale) {
            setPendingLocale(resolved);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialLocale, localeResolver]);

    useEffect(() => {
        let cancelled = false;

        const preload = catalogProvider?.preloadLocale;
        if (typeof preload !== 'function') {
            setIsCatalogReady(true);
            setHasLoadedOnce(true);
            if (pendingLocale) {
                setActiveLocale(pendingLocale);
                setPendingLocale(null);
            }
            return;
        }
        const preloadLocale: (locale: Locale) => Promise<void> = preload;

        // Loads catalogs for the desired locale and applies it after preload.
        const desiredLocale = pendingLocale ?? activeLocale;
        const sequence = ++loadSequence.current;

        async function run() {
            setIsCatalogReady(false);

            let overlayTimer: number | null = null;
            // Shows overlay after a delay while catalogs load.
            if (hasLoadedOnce && loadingOverlayDelayMs >= 0) {
                overlayTimer = window.setTimeout(() => {
                    if (!cancelled && loadSequence.current === sequence) {
                        setShowOverlay(true);
                    }
                }, loadingOverlayDelayMs);
            }

            try {
                await preloadLocale(desiredLocale);
                if (
                    resolvedFallbackLocale &&
                    resolvedFallbackLocale !== desiredLocale
                ) {
                    await preloadLocale(resolvedFallbackLocale);
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

                if (!cancelled) {
                    if (loadSequence.current === sequence) {
                        setShowOverlay(false);
                        setHasLoadedOnce(true);
                        setIsCatalogReady(true);

                        // Applies the pending locale after its catalogs are loaded.
                        if (pendingLocale) {
                            setActiveLocale(desiredLocale);
                            setPendingLocale(null);
                        }
                    }
                }
            }
        }

        run();

        return () => {
            cancelled = true;
            setShowOverlay(false);
        };
    }, [
        activeLocale,
        pendingLocale,
        catalogProvider,
        resolvedFallbackLocale,
        hasLoadedOnce,
        loadingFallback,
        loadingOverlayDelayMs,
    ]);

    const setLocale = useCallback(
        (nextLocale: string): Locale => {
            const resolved = localeResolver.resolve(nextLocale as Locale);
            // Marks as pending; it becomes active after catalogs are loaded.
            if (resolved !== activeLocale) {
                setPendingLocale(resolved);
            }
            return resolved;
        },
        [activeLocale, localeResolver],
    );

    const translate = useCallback(
        (key: string, params?: TranslationParams, namespace?: Namespace) => {
            return translationResolver.translate(
                activeLocale,
                namespace,
                key,
                params,
            );
        },
        [activeLocale, translationResolver],
    );

    const contextValue = useMemo(
        () => ({
            locale: activeLocale,
            supportedLocales: localeResolver.supportedLocales,
            setLocale,
            translate,
        }),
        [activeLocale, localeResolver, setLocale, translate],
    );

    if (!isCatalogReady) {
        if (!hasLoadedOnce) {
            return <>{loadingFallback}</>;
        }
    }

    return (
        <I18nContext.Provider value={contextValue}>
            {children}
            {showOverlay ? (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        {loadingOverlay ??
                            loadingFallback ?? (
                                <div className="rounded-md border bg-background/90 px-4 py-2 shadow">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/70" />
                                        <span>Loading…</span>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            ) : null}
        </I18nContext.Provider>
    );
}
