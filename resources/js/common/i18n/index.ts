export { I18N_NAMESPACES } from './namespaces';

export {
  createI18nEnvironment,
  translatorProvider,
} from './environment';

export { createI18nRegistry } from './registry';
export type { I18nPreloader, I18nRegistry } from './registry';

export type { TranslationModuleLoaders } from './i18next/types';
export type { PlaceholderValues } from './types';

export {
  LanguageSelector,
  I18nScopeGate,
  useTranslation,
} from './react';
