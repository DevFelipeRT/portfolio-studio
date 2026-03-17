import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloader } from '@/common/i18n/i18next/preloader';

export const websiteSettingsTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const websiteSettingsI18nextPreloader = createI18nextPreloader(
  'website-settings',
  websiteSettingsTranslationModuleLoaders,
);

createI18nRegistry().register(
  'website-settings',
  websiteSettingsI18nextPreloader,
);
