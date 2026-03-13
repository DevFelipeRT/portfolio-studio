import { canonicalizeLocale } from './canonicalizers/localeCanonicalizer';
import type { Locale, LocaleInput } from './types';

/**
 * Canonicalizes a supported locales list and returns a deduplicated result.
 */
export function canonicalizeSupportedLocales(
  configured: readonly LocaleInput[],
  defaultLocale: Locale,
): readonly Locale[] {
  const canonical = configured
    .map(canonicalizeLocale)
    .filter((value): value is Locale => value !== null);

  canonical.push(defaultLocale);

  return Array.from(new Set<Locale>(canonical));
}
