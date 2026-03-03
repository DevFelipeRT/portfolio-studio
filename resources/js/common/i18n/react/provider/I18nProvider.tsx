'use client';

import { useCallback, useMemo } from 'react';
import { I18nContext } from '../I18nContext';
import type { I18nContextValue } from '../I18nContext';
import type { Namespace, PlaceholderValues } from '../../core/types';
import { LoadingOverlay } from './LoadingOverlay';
import { useI18nProviderState } from './state/useI18nProviderState';
import type { I18nProviderProps } from './types';

/**
 * Provides the i18n context value (locale, supported locales, translate, and
 * setLocale) for descendant components.
 *
 * During the initial catalog preload, it renders `loadingFallback` instead of
 * the children. After the first preload attempt completes, children keep
 * rendering while subsequent preload attempts may display a full-screen overlay
 * when requested by the provider state.
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
    const {
        activeLocale,
        supportedLocales,
        isCatalogReady,
        hasLoadedOnce,
        showOverlay,
        setLocale,
    } = useI18nProviderState({
        initialLocale,
        fallbackLocale,
        localeResolver,
        translatorProvider,
        loadingOverlayDelayMs,
    });

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

    const overlayContent = useMemo(() => {
        return loadingOverlay ?? loadingFallback;
    }, [loadingFallback, loadingOverlay]);

    if (!isCatalogReady) {
        if (!hasLoadedOnce) {
            return <>{loadingFallback}</>;
        }
    }

    return (
        <I18nContext.Provider value={contextValue}>
            {children}
            <LoadingOverlay open={showOverlay} content={overlayContent} />
        </I18nContext.Provider>
    );
}
