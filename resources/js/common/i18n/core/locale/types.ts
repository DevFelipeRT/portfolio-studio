import type { Locale, LocaleInput } from '../types';

/**
 * LocaleCanonicalizer converts a locale input into a canonical Locale identifier.
 */
export interface LocaleCanonicalizer {
  canonicalize(input: LocaleInput): Locale | null;
}
