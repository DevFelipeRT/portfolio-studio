import type { I18nPreloader } from '../types';
import { createI18nRegistry } from '../registry';

/**
 * Resolves concrete preloaders for a normalized scope selection.
 *
 * When no scope ids are provided, all currently registered preloaders are
 * returned.
 */
export async function resolvePreloadersForI18nScope(
  scopeIds?: readonly string[] | null,
): Promise<readonly I18nPreloader[]> {
  const registry = createI18nRegistry();

  if (!scopeIds) {
    return registry.getAllPreloaders();
  }

  await registry.ensureRegistered(scopeIds);

  return scopeIds
    .map((id) => registry.getPreloader(id))
    .filter((preloader): preloader is I18nPreloader => Boolean(preloader));
}
