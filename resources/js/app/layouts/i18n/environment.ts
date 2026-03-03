import {
  createTranslatorProviderFromLoaders,
  createI18nRegistry,
  type TranslationModuleLoaders,
} from '@/common/i18n';

export const layoutsTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const layoutsTranslatorProvider = createTranslatorProviderFromLoaders(
  layoutsTranslationModuleLoaders,
);

export const layoutsTranslator = layoutsTranslatorProvider.createTranslator({});

createI18nRegistry().register('layouts', layoutsTranslatorProvider);
