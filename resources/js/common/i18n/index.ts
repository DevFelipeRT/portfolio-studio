export { I18N_NAMESPACES } from './namespaces';

export {
  catalogProvider,
  createI18nEnvironment,
  translatorProvider,
} from './environment';

export { createI18nRegistry } from './registry';
export type { I18nPreloader, I18nRegistry } from './registry';

export { createTranslatorProviderFromLoaders } from './core/translation';
export type { TranslationModuleLoaders } from './core/translation';
export type { PlaceholderValues } from './core/types';

export {
  I18nContext,
  I18nProvider,
  LanguageSelector,
  LocaleSwitcher,
  TranslationCatalogGate,
  useGetLocale,
  useSupportedLocales,
  useTranslation,
} from './react';
