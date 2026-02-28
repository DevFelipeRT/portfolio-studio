/**
 * TranslationPrimitive is a value type accepted for template interpolation parameters.
 */
export type TranslationPrimitive = string | number | boolean;

/**
 * PlaceholderValues provides named values used to replace placeholders during interpolation.
 */
export type PlaceholderValues = Record<string, TranslationPrimitive>;

/**
 * Translation is the resolved, display-ready localized string.
 */
export type Translation = string;

/**
 * TranslationValue is the leaf string stored in a TranslationTree.
 */
export type TranslationValue = string;

/**
 * TranslationPath identifies a translation entry inside a TranslationTree using dot notation.
 */
export type TranslationPath = string;

/**
 * PlaceholderIdentifier is the identifier found inside a placeholder.
 */
export type PlaceholderIdentifier = string;

/**
 * Placeholder represents a placeholder occurrence inside a translation value.
 */
export interface Placeholder {
    identifier: PlaceholderIdentifier;
    raw: string;
}

/**
 * TranslationTemplate represents a translation value that contains one or more placeholders.
 */
export interface TranslationTemplate {
    value: TranslationValue;
    placeholders: readonly Placeholder[];
}

/**
 * TranslationNodeKey identifies a single key segment inside a TranslationTree.
 */
export type TranslationNodeKey = string;

/**
 * TranslationNode represents either a nested translation tree or a leaf translation value.
 */
export type TranslationNode = TranslationValue | TranslationTree;

/**
 * TranslationTree is the structured content exported by a translation module, modeled as a nested key/value tree.
 */
export interface TranslationTree {
    [key: TranslationNodeKey]: TranslationNode;
}
