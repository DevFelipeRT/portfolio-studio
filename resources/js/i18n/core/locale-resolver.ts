import { Locale } from './types';

export interface LocaleConfig {
    supportedLocales: readonly Locale[];
    defaultLocale: Locale;
}

/**
 * LocaleResolver normalizes and validates locale codes against the configured set.
 */
export interface LocaleResolver {
    readonly supportedLocales: readonly Locale[];
    readonly defaultLocale: Locale;
    resolve(input: string | null | undefined): Locale;
    isSupported(locale: Locale): boolean;
}

/**
 * Creates a stateless LocaleResolver that validates and normalizes locale values.
 *
 * The default locale is always included in the supportedLocales set.
 * When the configured supportedLocales list is empty or invalid, the resolver
 * falls back to a single-element set containing only the default locale.
 */
export function createLocaleResolver(config: LocaleConfig): LocaleResolver {
    const defaultLocale = normalizeLocaleCode(config.defaultLocale);

    if (!defaultLocale) {
        throw new Error('LocaleResolver requires a non-empty default locale.');
    }

    const configured = Array.isArray(config.supportedLocales)
        ? config.supportedLocales
        : [];

    const normalizedSupported = Array.from(
        new Set(
            [...configured, defaultLocale]
                .map(normalizeLocaleCode)
                .filter((value) => value !== ''),
        ),
    );

    function isSupported(locale: Locale): boolean {
        const normalized = normalizeLocaleCode(locale);
        return normalizedSupported.includes(normalized);
    }

    function resolve(input: string | null | undefined): Locale {
        if (input) {
            const normalized = normalizeLocaleCode(input);
            if (normalizedSupported.includes(normalized)) {
                return normalized;
            }
        }

        return defaultLocale;
    }

    return {
        supportedLocales: normalizedSupported,
        defaultLocale,
        resolve,
        isSupported,
    };
}

/**
 * Normalizes a locale code string into a consistent representation.
 */
function normalizeLocaleCode(locale: string): string {
    return locale.trim();
}
