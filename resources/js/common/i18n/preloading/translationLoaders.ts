import type { TranslationLoaders } from '../i18next/types';

/**
 * Default app-wide translation loaders.
 *
 * Structure convention:
 * - ../locales/{locale}/{namespace}.ts
 *
 * Domains should expose their own scoped i18n preloaders for i18next (and
 * local loading UI) via `createI18nextPreloaderFromLoaders(...)`.
 */
export const translationLoaders = {
    ...import.meta.glob('../locales/*/*.ts'),
} as TranslationLoaders;
