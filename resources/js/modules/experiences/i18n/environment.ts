import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloader } from '@/common/i18n/i18next/preloader';

export const experiencesTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const experiencesI18nextPreloader = createI18nextPreloader(
  'experiences',
  experiencesTranslationModuleLoaders,
);

createI18nRegistry().register('experiences', experiencesI18nextPreloader);
