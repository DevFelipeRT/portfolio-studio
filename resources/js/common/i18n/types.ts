export type { Locale, LocaleInput } from '@/common/locale';

/**
 * Namespace identifies a translation module within a locale.
 */
export type Namespace = string;

/**
 * TranslationPrimitive is a value type accepted for interpolation parameters.
 */
export type TranslationPrimitive = string | number | boolean;

/**
 * PlaceholderValues provides named values used to replace placeholders during interpolation.
 */
export type PlaceholderValues = Record<string, TranslationPrimitive>;

/**
 * TranslationTree is the structured content exported by a translation module,
 * modeled as a nested key/value tree.
 */
export type TranslationTree = {
  [key: string]: string | TranslationTree;
};
