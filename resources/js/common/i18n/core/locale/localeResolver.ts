import type { Locale, LocaleInput } from '../types';
import { canonicalizeLocale } from './localeCanonicalizer';
import { canonicalizeSupportedLocales } from './supportedLocalesList';

export interface LocaleConfig {
  supportedLocales: readonly LocaleInput[];
  defaultLocale: LocaleInput;
}

/**
 * LocaleResolver validates locale inputs against a configured supported set.
 */
export interface LocaleResolver {
  readonly supportedLocales: readonly Locale[];
  readonly defaultLocale: Locale;
  resolve(input: LocaleInput | null | undefined): Locale;
  isSupported(input: LocaleInput): boolean;
}

/**
 * Creates a LocaleResolver from runtime locale configuration.
 */
export function createLocaleResolver(config: LocaleConfig): LocaleResolver {
  const defaultLocale = canonicalizeLocale(config.defaultLocale);

  if (!defaultLocale) {
    throw new Error('LocaleResolver requires a non-empty default locale.');
  }

  const canonicalDefaultLocale: Locale = defaultLocale;

  const supportedLocales = canonicalizeSupportedLocales(
    config.supportedLocales,
    canonicalDefaultLocale,
  );
  const frozenSupportedLocales = Object.freeze([...supportedLocales]) as readonly Locale[];
  const supportedSet = new Set<Locale>(frozenSupportedLocales);

  function isSupported(input: LocaleInput): boolean {
    const normalized = canonicalizeLocale(input);
    return normalized ? supportedSet.has(normalized) : false;
  }

  function resolve(input: LocaleInput | null | undefined): Locale {
    if (input) {
      const normalized = canonicalizeLocale(input);
      if (normalized && supportedSet.has(normalized)) {
        return normalized;
      }
    }

    return canonicalDefaultLocale;
  }

  return {
    supportedLocales: frozenSupportedLocales,
    defaultLocale: canonicalDefaultLocale,
    resolve,
    isSupported,
  };
}
