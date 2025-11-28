export type Locale = string;
export type Namespace = string;

export type TranslationPrimitive = string | number | boolean;

export type TranslationParams = Record<string, TranslationPrimitive>;

export type TranslationValue = string;

export type TranslationNode = TranslationValue | TranslationTree;

export interface TranslationTree {
    [key: string]: TranslationNode;
}

/**
 * NamespacedCatalog represents a set of translation trees grouped by namespace for a single locale.
 */
export interface NamespacedCatalog {
    [namespace: Namespace]: TranslationTree;
}
