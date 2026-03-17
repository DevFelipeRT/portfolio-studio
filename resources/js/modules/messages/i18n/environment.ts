import {
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';
import { createI18nextPreloader } from '@/common/i18n/i18next/preloader';

export const messagesTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const messagesI18nextPreloader = createI18nextPreloader(
  'messages',
  messagesTranslationModuleLoaders,
);

createI18nRegistry().register('messages', messagesI18nextPreloader);
