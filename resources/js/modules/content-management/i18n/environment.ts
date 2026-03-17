import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloader } from '@/common/i18n/i18next/preloader';

export const contentManagementTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const contentManagementI18nextPreloader = createI18nextPreloader(
  'content-management',
  contentManagementTranslationModuleLoaders,
);

createI18nRegistry().register(
  'content-management',
  contentManagementI18nextPreloader,
);
