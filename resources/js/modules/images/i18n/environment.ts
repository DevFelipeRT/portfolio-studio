import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloader } from '@/common/i18n/i18next/preloader';

export const imagesTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const imagesI18nextPreloader = createI18nextPreloader(
  'images',
  imagesTranslationModuleLoaders,
);

createI18nRegistry().register('images', imagesI18nextPreloader);
