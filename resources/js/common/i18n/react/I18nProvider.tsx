'use client';

import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
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
};

/**
 * I18nProvider wires the locale resolver and translation resolver
 * into a React context with a stateful locale.
 */
export function I18nProvider({
    children,
    initialLocale,
    localeResolver,
    translationResolver,
    fallbackLocale = null,
    catalogProvider,
    loadingFallback = null,
}: I18nProviderProps) {
    const resolvedInitial: Locale = localeResolver.resolve(
        initialLocale ?? localeResolver.defaultLocale,
    );

    const [activeLocale, setActiveLocale] = useState<Locale>(resolvedInitial);
    const [isCatalogReady, setIsCatalogReady] = useState<boolean>(false);

    const resolvedFallbackLocale = useMemo(() => {
        if (!fallbackLocale) {
            return null;
        }
        return localeResolver.resolve(fallbackLocale);
    }, [fallbackLocale, localeResolver]);

    useEffect(() => {
        const resolved = localeResolver.resolve(
            initialLocale ?? localeResolver.defaultLocale,
        );

        if (resolved !== activeLocale) {
            setActiveLocale(resolved);
        }
    }, [activeLocale, initialLocale, localeResolver]);

    useEffect(() => {
        let cancelled = false;

        const preload = catalogProvider?.preloadLocale;
        if (typeof preload !== 'function') {
            setIsCatalogReady(true);
            return;
        }
        const preloadLocale: (locale: Locale) => Promise<void> = preload;

        async function run() {
            setIsCatalogReady(false);
            try {
                await preloadLocale(activeLocale);
                if (
                    resolvedFallbackLocale &&
                    resolvedFallbackLocale !== activeLocale
                ) {
                    await preloadLocale(resolvedFallbackLocale);
                }
            } catch (error) {
                if (import.meta.env.DEV) {
                    // eslint-disable-next-line no-console
                    console.warn('[i18n] Failed to preload catalogs.', error);
                }
            } finally {
                if (!cancelled) {
                    setIsCatalogReady(true);
                }
            }
        }

        run();

        return () => {
            cancelled = true;
        };
    }, [activeLocale, catalogProvider, resolvedFallbackLocale]);

    const setLocale = useCallback(
        (nextLocale: string): Locale => {
            const resolved = localeResolver.resolve(nextLocale as Locale);
            setIsCatalogReady(false);
            setActiveLocale(resolved);
            return resolved;
        },
        [localeResolver],
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
        return <>{loadingFallback}</>;
    }

    return (
        <I18nContext.Provider value={contextValue}>
            {children}
        </I18nContext.Provider>
    );
}
