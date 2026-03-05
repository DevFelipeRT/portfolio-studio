/**
 * Locale is the canonical locale identifier used as a stable key throughout the app.
 */
export type Locale = string;

/**
 * LocaleInput represents an untrusted locale value coming from runtime inputs.
 */
export type LocaleInput = string;

/**
 * LocaleCanonicalizer converts a locale input into a canonical Locale identifier.
 */
export interface LocaleCanonicalizer {
  canonicalize(input: LocaleInput): Locale | null;
}
