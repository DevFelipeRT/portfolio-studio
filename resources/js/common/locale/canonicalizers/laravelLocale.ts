import type { Locale, LocaleInput } from '../types';

/**
 * Canonicalizes a locale input using Laravel-style locale conventions.
 *
 * Canonical form:
 * - `language` in lowercase (2–3 letters)
 * - optional `region` separated by `_`, either:
 *   - 2 letters in uppercase (e.g. `pt_BR`)
 *   - 3 digits (e.g. `es_419`)
 */
export function canonicalizeLaravelLocale(input: LocaleInput): Locale | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = trimmed
    .replace(/\s*[-_]\s*/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  if (!normalized) {
    return null;
  }

  const parts = normalized.split('_').filter(Boolean);
  if (parts.length === 0 || parts.length > 2) {
    return null;
  }

  const language = parts[0]!.toLowerCase();
  if (!/^[a-z]{2,3}$/.test(language)) {
    return null;
  }

  if (parts.length === 1) {
    return language as Locale;
  }

  const regionRaw = parts[1]!;

  if (/^\d{3}$/.test(regionRaw)) {
    return `${language}_${regionRaw}` as Locale;
  }

  const region = regionRaw.toUpperCase();
  if (!/^[A-Z]{2}$/.test(region)) {
    return null;
  }

  return `${language}_${region}` as Locale;
}
