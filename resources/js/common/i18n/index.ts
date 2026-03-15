/**
 * Public i18n surface consumed outside the root `common/i18n` module.
 */
export { I18N_NAMESPACES } from './namespaces';

export {
  createI18nRuntime as createInitializedI18nRuntime,
} from './runtime';
export { getI18nRuntime, setI18nRuntimeLocale } from './i18next';
export { preloadI18nBundles, preloaderForI18nScopes } from './preloading';

export { createI18nRegistry } from './registry';
export type { I18nPreloader, I18nRegistry } from './types';

export type { BundleLoaders as TranslationModuleLoaders } from './i18next/types';
export type { PlaceholderValues } from './types';

export {
  LanguageSelector,
  I18nRuntimeProvider,
  I18nScopeGate,
  useTranslation,
} from './react';
