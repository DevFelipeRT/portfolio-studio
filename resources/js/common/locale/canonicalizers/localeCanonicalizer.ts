import type { Locale, LocaleInput, LocaleCanonicalizer } from '../types';
import { canonicalizeLaravelLocale } from './laravelLocale';

/**
 * Locale canonicalizer based on the Laravel-style locale format used by the app.
 */
const laravelLocaleCanonicalizer: LocaleCanonicalizer = {
  canonicalize(input: LocaleInput): Locale | null {
    return canonicalizeLaravelLocale(input);
  },
};

/**
 * The canonicalizer used by the locale module.
 */
export const localeCanonicalizer: LocaleCanonicalizer = laravelLocaleCanonicalizer;

/**
 * Canonicalizes a locale input into a Locale identifier.
 */
export function canonicalizeLocale(input: LocaleInput): Locale | null {
  return localeCanonicalizer.canonicalize(input);
}
