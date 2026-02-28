import type { Catalog } from '../types';
import type { Locale } from '../types';
import type { Namespace } from '../types';
import type { TranslationPath } from '../types';
import type { PlaceholderValues } from '../types';
import type { TranslationTree } from '../types';

/**
 * Translator resolves translation paths to localized strings for a given locale and namespace.
 */
export interface Translator {
    translate(
        locale: Locale,
        namespace: Namespace | undefined,
        path: TranslationPath,
        params?: PlaceholderValues,
    ): string;
}

/**
 * MissingPathInfo describes a translation path that was not found for a given locale and namespace.
 */
export interface MissingPathInfo {
    locale: Locale;
    namespace: Namespace;
    path: TranslationPath;
}

/**
 * TranslatorOptions configures namespace defaults, fallback behavior, and missing-key reporting.
 */
export type TranslatorOptions = {
    defaultNamespace?: Namespace;
    fallbackLocale?: Locale;
    onMissingKey?(info: MissingPathInfo): void;
};

/**
 * TranslationModuleLoaders maps module paths to loader functions that resolve to a default TranslationTree export.
 */
export type TranslationModuleLoaders = Record<
    string,
    () => Promise<{ default: TranslationTree }>
>;

/**
 * TranslatorFactoryConfig is the configuration used when constructing a Translator instance.
 */
export type TranslatorFactoryConfig = TranslatorOptions;

/**
 * TranslatorProvider exposes catalog access and locale preloading for translation modules.
 */
export interface TranslatorProvider {
    getSupportedLocales(): readonly Locale[];
    getNamespaces(locale: Locale): readonly Namespace[];
    getCatalog(locale: Locale): Catalog | null;
    getTranslationTree(locale: Locale, namespace: Namespace): TranslationTree | null;
    preloadLocale(locale: Locale): Promise<void>;
    createTranslator(config: TranslatorFactoryConfig): Translator;
}
