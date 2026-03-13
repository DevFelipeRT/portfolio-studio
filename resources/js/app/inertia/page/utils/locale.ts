import type { InertiaPageProps } from '../../types';
import { resolveInertiaLocalizationContext } from '../../runtime';

/**
 * Resolves the initial locale based on the page props hierarchy.
 */
export function resolveInitialLocale(
  props: InertiaPageProps,
): string | undefined {
  return resolveInertiaLocalizationContext(props).currentLocale ?? undefined;
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
