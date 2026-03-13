import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloaderFromLoaders } from '@/common/i18n/i18next/preloaderFromLoaders';

export const coursesTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const coursesI18nextPreloader = createI18nextPreloaderFromLoaders(
  'courses',
  coursesTranslationModuleLoaders,
);

createI18nRegistry().register('courses', coursesI18nextPreloader);
