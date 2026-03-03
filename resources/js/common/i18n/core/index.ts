export type {
    Catalog,
    Locale,
    LocaleInput,
    Namespace,
    TranslationPath,
    TranslationNodeKey,
    TranslationNode,
    PlaceholderValues,
    TranslationPrimitive,
    TranslationTree,
    TranslationValue,
} from './types';

export { createStaticCatalogProvider } from './catalog';
export type {
    CatalogProvider,
    CatalogProviderOptions,
    CatalogSource,
} from './catalog';

export { createLocaleResolver } from './locale';
export type { LocaleConfig, LocaleResolver } from './locale';

export { createTranslator } from './translation';
export type { MissingPathInfo, Translator, TranslatorOptions } from './translation';
export {
    createTranslatorProviderFromLoaders,
    type TranslatorFactoryConfig,
    type TranslatorProvider,
    type TranslationModuleLoaders,
} from './translation';
