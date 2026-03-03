import {
  createTranslatorProviderFromLoaders,
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';

export const experiencesTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const experiencesTranslatorProvider = createTranslatorProviderFromLoaders(
  experiencesTranslationModuleLoaders,
);

export const experiencesTranslator = experiencesTranslatorProvider.createTranslator(
  {},
);

createI18nRegistry().register('experiences', experiencesTranslatorProvider);
