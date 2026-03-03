'use client';

import { createContext } from 'react';
import type { Locale, Namespace, PlaceholderValues } from '../core/types';

export interface I18nContextValue {
    locale: Locale;
    supportedLocales: readonly Locale[];
    setLocale(nextLocale: string): Locale;
    translate(
        key: string,
        params?: PlaceholderValues,
        namespace?: Namespace,
    ): string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
