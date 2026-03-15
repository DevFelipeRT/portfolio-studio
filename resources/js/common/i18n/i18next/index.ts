/**
 * Public i18next-specific surface consumed outside the `i18next` directory.
 */
export { ensureI18nextInitialized, getI18next } from './i18next';
export { getI18nRuntime, setI18nRuntimeLocale } from './runtime';
export { I18nProvider } from './provider';
export { useI18nextTranslation } from './hooks';
