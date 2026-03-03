import type { TranslationModuleLoaders } from '../core/translation';

/**
 * Default app-wide translation loaders.
 *
 * Structure convention:
 * - ../locales/{locale}/{namespace}.ts
 *
 * Domains should provide their own translation provider (and local React gate)
 * via `createTranslatorProviderFromLoaders(...)`.
 */
export const translationModuleLoaders = {
    ...import.meta.glob('../locales/*/*.ts'),
} as TranslationModuleLoaders;

