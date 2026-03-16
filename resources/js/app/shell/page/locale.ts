import type { AppPageProps } from '../types';
import { resolveAppLocalizationContext } from '../runtime';

/**
 * The initial-locale resolver derived from normalized application page props.
 */
export function resolveInitialLocale(props: AppPageProps): string | undefined {
  return resolveAppLocalizationContext(props).currentLocale ?? undefined;
}

/**
 * The localized-value selector used by shell title policy and other
 * locale-aware metadata helpers.
 */
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
