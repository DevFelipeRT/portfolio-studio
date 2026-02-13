import type { InertiaPageProps } from './types';

/**
 * Resolves the initial locale based on the page props hierarchy.
 */
export function resolveInitialLocale(
  props: InertiaPageProps,
): string | undefined {
  if (props.locale?.trim()) {
    return props.locale;
  }

  if (props.localization?.currentLocale?.trim()) {
    return props.localization.currentLocale;
  }

  return props.localization?.defaultLocale;
}

export function resolveLocalizedValue(
  map: Record<string, string> | null,
  locale: string,
  fallbackLocale: string,
): string | null {
  if (!map) {
    return null;
  }

  if (locale && map[locale]) {
    return map[locale];
  }

  if (fallbackLocale && map[fallbackLocale]) {
    return map[fallbackLocale];
  }

  return Object.values(map)[0] ?? null;
}

