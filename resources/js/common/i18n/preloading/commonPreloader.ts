import { createI18nextPreloader } from '../i18next/preloader';
import { bundleLoaders } from './bundle/bundleLoaders';

/**
 * Preloader for the shared application bundle located under `common/i18n/locales`.
 */
export const commonI18nPreloader = createI18nextPreloader(
  'common',
  bundleLoaders,
);
