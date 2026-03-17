import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloader } from '@/common/i18n/i18next/preloader';

export const skillsTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const skillsI18nextPreloader = createI18nextPreloader(
  'skills',
  skillsTranslationModuleLoaders,
);

createI18nRegistry().register('skills', skillsI18nextPreloader);
