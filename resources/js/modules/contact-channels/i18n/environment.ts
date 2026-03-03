import {
  createTranslatorProviderFromLoaders,
  type TranslationModuleLoaders,
} from '@/common/i18n';

export const contactChannelsTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const contactChannelsTranslatorProvider =
  createTranslatorProviderFromLoaders(contactChannelsTranslationModuleLoaders);

export const contactChannelsTranslator =
  contactChannelsTranslatorProvider.createTranslator({});

