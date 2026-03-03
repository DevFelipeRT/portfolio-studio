'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { I18nContext } from '../I18nContext';
import type { I18nContextValue } from '../I18nContext';
import type { Locale, Namespace, PlaceholderValues } from '../../core/types';
import type { I18nProviderProps } from './types';
import { TranslationCatalogGate } from './TranslationCatalogGate';

/**
 * Provides the i18n context value (locale, supported locales, translate, and
 * setLocale) for descendant components.
 */
export function I18nProvider({
    children,
    initialLocale,
    localeResolver,
    translator,
    fallbackLocale = null,
    translatorProvider,
    loadingFallback = null,
    loadingOverlay = null,
    loadingOverlayDelayMs = 250,
}: I18nProviderProps) {
    const resolvedInitialLocale: Locale = useMemo(() => {
        return localeResolver.resolve(initialLocale ?? localeResolver.defaultLocale);
    }, [initialLocale, localeResolver]);

    const [activeLocale, setActiveLocale] = useState<Locale>(resolvedInitialLocale);
    const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);

    useEffect(() => {
        if (resolvedInitialLocale !== activeLocale) {
            setPendingLocale(resolvedInitialLocale);
        }
    }, [resolvedInitialLocale, activeLocale]);

    const setLocale = useCallback(
        (nextLocale: string): Locale => {
            const resolved = localeResolver.resolve(nextLocale as Locale);
            if (resolved !== activeLocale) {
                setPendingLocale(resolved);
            }
            return resolved;
        },
        [activeLocale, localeResolver],
    );

    const supportedLocales = localeResolver.supportedLocales;

    const resolvedFallbackLocale = useMemo(() => {
        if (!fallbackLocale) {
            return null;
        }
        return localeResolver.resolve(fallbackLocale);
    }, [fallbackLocale, localeResolver]);

    const targetLocale = pendingLocale ?? activeLocale;

    const translate: I18nContextValue['translate'] = useCallback(
        (key: string, params?: PlaceholderValues, namespace?: Namespace) => {
            return translator.translate(activeLocale, namespace, key, params);
        },
        [activeLocale, translator],
    );

    const contextValue: I18nContextValue = useMemo(
        () => ({
            locale: activeLocale,
            supportedLocales,
            setLocale,
            translate,
        }),
        [activeLocale, supportedLocales, setLocale, translate],
    );

    return (
        <I18nContext.Provider value={contextValue}>
            <TranslationCatalogGate
                locale={targetLocale}
                fallbackLocale={resolvedFallbackLocale}
                translatorProvider={translatorProvider}
                loadingFallback={loadingFallback}
                loadingOverlay={loadingOverlay}
                loadingOverlayDelayMs={loadingOverlayDelayMs}
                strategy="keep"
                onReadyLocale={(ready) => {
                    if (pendingLocale && ready === pendingLocale) {
                        setActiveLocale(pendingLocale);
                        setPendingLocale(null);
                    }
                }}
            >
                {children}
            </TranslationCatalogGate>
        </I18nContext.Provider>
    );
}
