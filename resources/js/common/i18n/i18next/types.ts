import type { TranslationTree } from '../types';

/**
 * TranslationModuleLoaders maps module paths to loader functions that resolve to a
 * default TranslationTree export.
 */
export type TranslationLoaders = Record<
  string,
  () => Promise<{ default: TranslationTree }>
>;
