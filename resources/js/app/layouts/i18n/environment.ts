import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloader } from '@/common/i18n/i18next/preloader';

export const layoutsTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const layoutsI18nextPreloader = createI18nextPreloader(
  'layouts',
  layoutsTranslationModuleLoaders,
);

createI18nRegistry().register('layouts', layoutsI18nextPreloader);
