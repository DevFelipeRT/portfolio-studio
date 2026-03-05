import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloaderFromLoaders } from '@/common/i18n/i18next/preloaderFromLoaders';

export const projectsTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const projectsI18nextPreloader = createI18nextPreloaderFromLoaders(
  'projects',
  projectsTranslationModuleLoaders,
);

createI18nRegistry().register('projects', projectsI18nextPreloader);
