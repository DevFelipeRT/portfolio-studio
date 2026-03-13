export { I18N_NAMESPACES } from './namespaces';

export {
  getI18nRuntime,
  initializeI18nRuntime,
  setI18nRuntimeLocale,
} from './runtime';
export {
  preloadI18nBundles,
} from './preloading/preloader';
export { preloaderForI18nScopes } from './preloading/scopedPreloader';

export { createI18nRegistry } from './registry/registry';
export type { I18nPreloader, I18nRegistry } from './registry/registry';

export type { TranslationLoaders as TranslationModuleLoaders } from './i18next/types';
export type { PlaceholderValues } from './types';

export {
  LanguageSelector,
  I18nRuntimeProvider,
  I18nScopeGate,
  useTranslation,
} from './react';
