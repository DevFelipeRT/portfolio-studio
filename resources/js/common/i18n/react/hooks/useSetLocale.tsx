'use client';

import { router } from '@inertiajs/react';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { I18nContext } from '../I18nContext';

export type UseSetLocaleOptions = {
    cookieName?: string;
    maxAgeDays?: number;
    apiEndpoint?: string;
    persistClientCookie?: boolean;
    /**
     * Delay before reloading the current Inertia route.
     * - `0`: reload immediately
     * - `> 0`: reload after delay (only the last selection)
     * - `< 0`: disable reload (still persists cookie/API)
     */
    reloadDelayMs?: number;
};

export type SetLocaleHandler = (nextLocale: string) => Promise<string>;

/**
 * Hook to update the current locale, persist it in a cookie,
 * notify the backend, and reload the current Inertia route
 * while preserving scroll position and form state.
 *
 * UI locale changes are applied by `I18nProvider` after the target locale
 * catalogs are loaded. The reload aligns backend/Inertia props.
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
    const persistClientCookie = options?.persistClientCookie ?? true;
    const reloadDelayMs = options?.reloadDelayMs ?? 400;

    // Stores state for the debounced reload.
    const reloadTimerId = useRef<number | null>(null);
    const lastRequestedLocale = useRef<string | null>(null);
    const lastPersistPromise = useRef<Promise<unknown> | null>(null);

    useEffect(() => {
        return () => {
            if (reloadTimerId.current !== null) {
                window.clearTimeout(reloadTimerId.current);
                reloadTimerId.current = null;
            }
        };
    }, []);

    const handler: SetLocaleHandler = useCallback(
        async (nextLocale: string) => {
            const resolved = setLocale(nextLocale);
            lastRequestedLocale.current = resolved;

            if (persistClientCookie) {
                persistLocaleCookie(cookieName, resolved, maxAgeDays);
            }

            const persistPromise = fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ locale: resolved }),
                credentials: 'include',
            }).catch((error) => {
                console.error('Failed to persist locale on backend:', error);
            });

            lastPersistPromise.current = persistPromise;

            // Debounced reload: rapid toggles should only reload once (last selection).
            if (reloadTimerId.current !== null) {
                window.clearTimeout(reloadTimerId.current);
                reloadTimerId.current = null;
            }

            if (reloadDelayMs >= 0) {
                reloadTimerId.current = window.setTimeout(() => {
                    if (lastRequestedLocale.current !== resolved) {
                        return;
                    }

                    void (async () => {
                        await lastPersistPromise.current;
                        router.visit(window.location.pathname, {
                            method: 'get',
                            preserveState: true,
                            preserveScroll: true,
                        });
                    })();
                }, reloadDelayMs);
            }

            return resolved;
        },
        [
            setLocale,
            cookieName,
            maxAgeDays,
            apiEndpoint,
            persistClientCookie,
            reloadDelayMs,
        ],
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
