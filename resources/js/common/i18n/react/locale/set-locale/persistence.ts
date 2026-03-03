export type PersistLocaleOptions = {
    apiEndpoint: string;
    cookieName: string;
    maxAgeDays: number;
    persistClientCookie: boolean;
};

function getCsrfToken(): string {
    const el = document.querySelector('meta[name="csrf-token"]');
    return el?.getAttribute('content') ?? '';
}

function persistCookie(
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

function persistBackend(options: {
    apiEndpoint: string;
    locale: string;
    csrfToken: string;
}): Promise<unknown> {
    const { apiEndpoint, locale, csrfToken } = options;

    return fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({ locale }),
        credentials: 'include',
    }).catch((error) => {
        console.error('Failed to persist locale on backend:', error);
	});
}

/**
 * Persists a locale selection using the configured persistence options.
 */
export function persistLocale(locale: string, options: PersistLocaleOptions) {
    const { apiEndpoint, cookieName, maxAgeDays, persistClientCookie } = options;

    if (persistClientCookie) {
        persistCookie(cookieName, locale, maxAgeDays);
    }

    return persistBackend({
        apiEndpoint,
        locale,
        csrfToken: getCsrfToken(),
    });
}
