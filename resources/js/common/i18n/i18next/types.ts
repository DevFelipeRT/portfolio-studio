import type { TranslationTree } from '../types';

/**
 * TranslationModuleLoaders maps module paths to loader functions that resolve to a
 * default TranslationTree export.
 */
export type TranslationModuleLoaders = Record<
  string,
  () => Promise<{ default: TranslationTree }>
>;
