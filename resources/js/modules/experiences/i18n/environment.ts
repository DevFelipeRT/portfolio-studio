import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloaderFromLoaders } from '@/common/i18n/i18next/preloaderFromLoaders';

export const experiencesTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const experiencesI18nextPreloader = createI18nextPreloaderFromLoaders(
  'experiences',
  experiencesTranslationModuleLoaders,
);

createI18nRegistry().register('experiences', experiencesI18nextPreloader);
