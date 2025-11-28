'use client';

import { createContext } from 'react';
import type { Locale, Namespace, TranslationParams } from '../core/types';

export interface I18nContextValue {
    locale: Locale;
    setLocale(nextLocale: string): Locale;
    translate(
        key: string,
        params?: TranslationParams,
        namespace?: Namespace,
    ): string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
