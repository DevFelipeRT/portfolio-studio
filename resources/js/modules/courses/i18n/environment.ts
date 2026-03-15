import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloader } from '@/common/i18n/i18next/preloader';

export const coursesTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const coursesI18nextPreloader = createI18nextPreloader(
  'courses',
  coursesTranslationModuleLoaders,
);

createI18nRegistry().register('courses', coursesI18nextPreloader);
