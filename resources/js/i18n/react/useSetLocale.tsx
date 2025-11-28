'use client';

import { useCallback, useContext } from 'react';
import { I18nContext } from './I18nContext';

export type UseSetLocaleOptions = {
    cookieName?: string;
    maxAgeDays?: number;
};

export type SetLocaleHandler = (nextLocale: string) => string;

/**
 * useSetLocale exposes a locale update function that applies the
 * new locale to the i18n context and persists the value in a cookie.
 */
export function useSetLocale(options?: UseSetLocaleOptions): SetLocaleHandler {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useSetLocale must be used within an I18nProvider.');
    }

    const { setLocale } = context;

    const cookieName = options?.cookieName ?? 'locale';
    const maxAgeDays = options?.maxAgeDays ?? 30;

    const handler: SetLocaleHandler = useCallback(
        (nextLocale: string) => {
            const resolved = setLocale(nextLocale);

            persistLocaleCookie(cookieName, resolved, maxAgeDays);

            return resolved;
        },
        [setLocale, cookieName, maxAgeDays],
    );

    return handler;
}

/**
 * Writes the locale cookie to persist the user preference.
 */
function persistLocaleCookie(
    cookieName: string,
    locale: string,
    maxAgeDays: number,
): void {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAgeSeconds = maxAgeDays * 24 * 60 * 60;

    document.cookie = `${encodeURIComponent(cookieName)}=${encodeURIComponent(
        locale,
    )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}
