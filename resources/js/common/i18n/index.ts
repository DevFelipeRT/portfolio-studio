export { I18N_NAMESPACES } from './namespaces';

export {
  catalogProvider,
  createI18nEnvironment,
  translatorProvider,
} from './environment';

export { createTranslatorProviderFromLoaders } from './core/translation';
export type { TranslationModuleLoaders } from './core/translation';
export type { PlaceholderValues } from './core/types';

export {
  I18nContext,
  I18nProvider,
  LanguageSelector,
  LocaleSwitcher,
  useGetLocale,
  useSupportedLocales,
  useTranslation,
} from './react';
