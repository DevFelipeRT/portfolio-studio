import { Locale } from './types';

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

export interface I18nRegistry {
  /**
   * Registers a preloader under a stable id (e.g. 'projects').
   */
  register(id: string, preloader: I18nPreloader): void;

  /**
   * Defines how to load/register a given id on demand.
   *
   * The loader should import a module that registers the preloader via `register`.
   */
  define(id: string, load: () => Promise<unknown>): void;

  /**
   * Returns a stable preloader for the provided scope.
   *
   * When scope is omitted/null, all registered preloaders are included.
   */
  preloaderFor(scope?: readonly string[] | null): I18nPreloader;
}

export type I18nPreloader = {
  preloadLocale?(locale: Locale): Promise<void>;
};