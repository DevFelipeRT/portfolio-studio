import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloaderFromLoaders } from '@/common/i18n/i18next/preloaderFromLoaders';

export const layoutsTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const layoutsI18nextPreloader = createI18nextPreloaderFromLoaders(
  'layouts',
  layoutsTranslationModuleLoaders,
);

createI18nRegistry().register('layouts', layoutsI18nextPreloader);
