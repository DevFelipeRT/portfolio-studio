import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloader } from '@/common/i18n/i18next/preloader';

export const projectsTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const projectsI18nextPreloader = createI18nextPreloader(
  'projects',
  projectsTranslationModuleLoaders,
);

createI18nRegistry().register('projects', projectsI18nextPreloader);
