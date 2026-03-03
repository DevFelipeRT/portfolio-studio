import {
  createTranslatorProviderFromLoaders,
  type TranslationModuleLoaders,
} from '@/common/i18n';

export const projectsTranslationModuleLoaders = import.meta.glob(
  './locales/*/*.ts',
) as TranslationModuleLoaders;

export const projectsTranslatorProvider = createTranslatorProviderFromLoaders(
  projectsTranslationModuleLoaders,
);

export const projectsTranslator = projectsTranslatorProvider.createTranslator({});

