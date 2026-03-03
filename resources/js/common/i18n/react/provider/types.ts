'use client';

import type { ReactNode } from 'react';
import type { LocaleResolver } from '../../core/locale';
import type { Translator } from '../../core/translation';
import type { Locale } from '../../core/types';

/**
 * Optional integration point used by the provider state to preload translation
 * catalogs for a locale.
 */
export type I18nTranslatorProvider = {
    preloadLocale?(locale: Locale): Promise<void>;
};

/**
 * Props for `I18nProvider`.
 */
export type I18nProviderProps = {
    children: ReactNode;
    initialLocale: string | null;
    localeResolver: LocaleResolver;
    translator: Translator;
    fallbackLocale?: string | null;
    translatorProvider?: I18nTranslatorProvider;
    loadingFallback?: ReactNode;
    loadingOverlay?: ReactNode;
    loadingOverlayDelayMs?: number;
};
