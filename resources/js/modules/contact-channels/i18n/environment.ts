import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloader } from '@/common/i18n/i18next/preloader';

export const contactChannelsTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const contactChannelsI18nextPreloader = createI18nextPreloader(
  'contact-channels',
  contactChannelsTranslationModuleLoaders,
);

createI18nRegistry().register(
  'contact-channels',
  contactChannelsI18nextPreloader,
);
