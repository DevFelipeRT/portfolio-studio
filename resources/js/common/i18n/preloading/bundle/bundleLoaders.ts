import type { BundleLoaders } from '../../i18next/types';

/**
 * Translation module loaders for the shared application bundle.
 *
 * Modules are discovered from the shared `common/i18n/locales` directory.
 */
export const bundleLoaders = {
  ...import.meta.glob('../../locales/*/*.ts'),
} as BundleLoaders;
