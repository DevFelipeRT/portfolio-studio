'use client';

import { router } from '@inertiajs/react';
import { useCallback, useContext } from 'react';
import { I18nContext } from '../I18nContext';

export type UseSetLocaleOptions = {
    cookieName?: string;
    maxAgeDays?: number;
    apiEndpoint?: string;
};

export type SetLocaleHandler = (nextLocale: string) => Promise<string>;

/**
 * Hook to update the current locale, persist it in a cookie,
 * notify the backend, and reload the current Inertia route
 * while preserving scroll position and form state.
 */
export function useSetLocale(options?: UseSetLocaleOptions): SetLocaleHandler {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useSetLocale must be used within an I18nProvider.');
    }

    const { setLocale } = context;
    const cookieName = options?.cookieName ?? 'locale';
    const maxAgeDays = options?.maxAgeDays ?? 30;
    const apiEndpoint = options?.apiEndpoint ?? '/set-locale';

    const handler: SetLocaleHandler = useCallback(
        async (nextLocale: string) => {
            const resolved = setLocale(nextLocale);

            persistLocaleCookie(cookieName, resolved, maxAgeDays);

            try {
                await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': getCsrfToken(),
                    },
                    body: JSON.stringify({ locale: resolved }),
                    credentials: 'include',
                });
            } catch (error) {
                console.error('Failed to persist locale on backend:', error);
            }

            // Reload the current route preserving state
            router.visit(window.location.pathname, {
                method: 'get',
                preserveState: true,
                preserveScroll: true,
            });

            return resolved;
        },
        [setLocale, cookieName, maxAgeDays, apiEndpoint],
    );

    return handler;
}

/** Persist the locale in a secure client-side cookie */
function persistLocaleCookie(
    cookieName: string,
    locale: string,
    maxAgeDays: number,
) {
    if (typeof document === 'undefined') return;

    const maxAgeSeconds = maxAgeDays * 24 * 60 * 60;
    const expires = new Date(Date.now() + maxAgeSeconds * 1000).toUTCString();
    const secureFlag = location.protocol === 'https:' ? '; Secure' : '';

    document.cookie = `${encodeURIComponent(cookieName)}=${encodeURIComponent(
        locale,
    )}; Path=/; Expires=${expires}; SameSite=Lax${secureFlag}`;
}

/** Retrieve CSRF token from meta tag */
function getCsrfToken(): string {
    const el = document.querySelector('meta[name="csrf-token"]');
    return el?.getAttribute('content') ?? '';
}
