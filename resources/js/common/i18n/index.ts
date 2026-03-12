export { I18N_NAMESPACES } from './namespaces';

export { createI18nEnvironment, translatorProvider } from './environment';
export {
  getI18nRuntime,
  initializeI18nRuntime,
  setI18nRuntimeLocale,
} from './runtime';
export {
  createScopedI18nPreloader,
  preloadCommonI18n,
  preloadI18nScopes,
  preloaderForI18nScopes,
} from './preloading/preloading';

export { createI18nRegistry } from './registry';
export type { I18nPreloader, I18nRegistry } from './registry';

export type { TranslationModuleLoaders } from './i18next/types';
export type { PlaceholderValues } from './types';

export {
  LanguageSelector,
  I18nRuntimeProvider,
  I18nScopeGate,
  useSetLocale,
  useTranslation,
} from './react';
