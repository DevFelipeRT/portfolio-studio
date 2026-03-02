import {
  createTranslatorProviderFromLoaders,
  type TranslationModuleLoaders,
} from '@/common/i18n';

export const coursesTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const coursesTranslatorProvider = createTranslatorProviderFromLoaders(
  coursesTranslationModuleLoaders,
);

export const coursesTranslator = coursesTranslatorProvider.createTranslator({});

