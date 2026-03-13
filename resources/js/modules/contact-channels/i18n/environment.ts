import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloaderFromLoaders } from '@/common/i18n/i18next/preloaderFromLoaders';

export const contactChannelsTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const contactChannelsI18nextPreloader = createI18nextPreloaderFromLoaders(
  'contact-channels',
  contactChannelsTranslationModuleLoaders,
);

createI18nRegistry().register(
  'contact-channels',
  contactChannelsI18nextPreloader,
);
