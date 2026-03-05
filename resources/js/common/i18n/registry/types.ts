import type { Locale } from '@/common/locale';

export type I18nPreloader = {
  preloadLocale?(locale: Locale): Promise<void>;
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
