import type { Locale } from '@/common/locale';

export type { Locale, LocaleInput } from '@/common/locale';

/**
 * Translation namespace identifier.
 */
export type Namespace = string;

/**
 * Value accepted for translation interpolation parameters.
 */
export type TranslationPrimitive = string | number | boolean;

/**
 * Named interpolation values passed to translation calls.
 */
export type PlaceholderValues = Record<string, TranslationPrimitive>;

/**
 * Nested translation content exported by a translation module.
 */
export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

/**
 * Public registry contract used by runtime and preloading code.
 */
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
   * Ensures preloaders for the provided ids are registered.
   */
  ensureRegistered(ids: readonly string[]): Promise<void>;

  /**
   * Reads a registered preloader by id.
   */
  getPreloader(id: string): I18nPreloader | undefined;

  /**
   * Reads all currently registered preloaders.
   */
  getAllPreloaders(): readonly I18nPreloader[];

  /**
   * Monotonic version for cache invalidation when registrations change.
   */
  getVersion(): number;
}

/**
 * Contract implemented by all i18n preloaders.
 */
export type I18nPreloader = {
  preloadLocale?(locale: Locale): Promise<void>;
};
