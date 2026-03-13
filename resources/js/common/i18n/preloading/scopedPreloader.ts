import { createI18nRegistry } from "../registry/registry";
import { I18nPreloader } from "../types";

/**
 * Registry preloader for a scope selection.
 */
export function preloaderForI18nScopes(
  scopeIds?: readonly string[] | null,
): I18nPreloader {
  return createI18nRegistry().preloaderFor(scopeIds);
}
