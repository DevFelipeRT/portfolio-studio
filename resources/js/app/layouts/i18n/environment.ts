import {
  createTranslatorProviderFromLoaders,
  type TranslationModuleLoaders,
} from '@/common/i18n';

export const layoutsTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const layoutsTranslatorProvider = createTranslatorProviderFromLoaders(
  layoutsTranslationModuleLoaders,
);

export const layoutsTranslator = layoutsTranslatorProvider.createTranslator({});

