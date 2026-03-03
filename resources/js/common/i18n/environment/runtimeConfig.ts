import type { Locale } from '../core/types';

export type RuntimeLocalizationConfig = {
    supportedLocales?: unknown;
    defaultLocale?: unknown;
    fallbackLocale?: unknown;
};

export type NormalizedRuntimeLocalizationConfig = {
    supportedLocales: Locale[];
    defaultLocale: Locale;
    fallbackLocale: Locale;
};

/**
 * Normalizes backend-provided configuration, ensuring valid fallback values.
 */
export function normalizeRuntimeConfig(
    runtimeConfig: RuntimeLocalizationConfig,
): NormalizedRuntimeLocalizationConfig {
    const rawSupported = Array.isArray(runtimeConfig.supportedLocales)
        ? runtimeConfig.supportedLocales
        : [];

    const supportedLocales: Locale[] = rawSupported
        .filter((value): value is string => typeof value === 'string')
        .map((value) => value.trim())
        .filter((value): value is Locale => value.length > 0);

    let defaultLocale: Locale = 'en' as Locale;
    if (
        typeof runtimeConfig.defaultLocale === 'string' &&
        runtimeConfig.defaultLocale.trim() !== ''
    ) {
        defaultLocale = runtimeConfig.defaultLocale.trim() as Locale;
    }

    let fallbackLocale: Locale = defaultLocale;
    if (
        typeof runtimeConfig.fallbackLocale === 'string' &&
        runtimeConfig.fallbackLocale.trim() !== ''
    ) {
        fallbackLocale = runtimeConfig.fallbackLocale.trim() as Locale;
    }

    return {
        supportedLocales,
        defaultLocale,
        fallbackLocale,
    };
}

