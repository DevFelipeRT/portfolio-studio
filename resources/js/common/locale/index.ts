export {
  canonicalizeLocale,
  localeCanonicalizer,
} from './canonicalizers/localeCanonicalizer';
export { createLocaleResolver } from './localeResolver';
export type { LocaleConfig, LocaleResolver } from './localeResolver';
export {
  LocaleSwitcher,
  useGetLocale,
  useSetLocale,
  useSupportedLocales,
} from './react';
export type {
  LocaleSwitcherProps,
  SetLocaleHandler,
  UseSetLocaleOptions,
} from './react';
export {
  normalizeRuntimeConfig,
  type NormalizedRuntimeLocalizationConfig,
  type RuntimeLocalizationConfig,
} from './runtimeConfig';
export { canonicalizeSupportedLocales } from './supportedLocalesList';
export type { Locale, LocaleCanonicalizer, LocaleInput } from './types';
