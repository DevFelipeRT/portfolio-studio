import type { TranslationTree } from '../types';

/**
 * Translation module loaders keyed by module path.
 */
export type BundleLoaders = Record<
  string,
  () => Promise<{ default: TranslationTree }>
>;
