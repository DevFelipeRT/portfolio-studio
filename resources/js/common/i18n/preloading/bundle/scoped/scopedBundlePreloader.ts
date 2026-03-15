import type { Locale } from '@/common/locale';
import type { I18nPreloader } from '../../../types';
import { createI18nRegistry } from '../../../registry';
import { resolvePreloadersForI18nScope } from '../../preloaderResolver';
import { createI18nScope } from './scope';

type CacheEntry = {
  version: number;
  preloader: I18nPreloader;
};

const cacheByScopeKey = new Map<string, CacheEntry>();

/**
 * Creates a preloader bound to a normalized scope selection.
 */
function createScopedPreloader(scopeIds?: readonly string[] | null): I18nPreloader {
  const scope = createI18nScope(scopeIds);

  return {
    async preloadLocale(locale: Locale): Promise<void> {
      const preloaders = await resolvePreloadersForI18nScope(
        scope.isAll() ? null : scope.ids(),
      );
      await Promise.all(
        preloaders.map((preloader) => preloader.preloadLocale?.(locale)),
      );
    },
  };
}

/**
 * Returns a stable scoped bundle preloader for the provided scope ids.
 */
export function preloaderForI18nScopes(
  scopeIds?: readonly string[] | null,
): I18nPreloader {
  const scope = createI18nScope(scopeIds);
  const key = scope.key();
  const registry = createI18nRegistry();
  const version = registry.getVersion();
  const cached = cacheByScopeKey.get(key);

  if (cached && cached.version === version) {
    return cached.preloader;
  }

  const preloader = createScopedPreloader(scope.ids());
  cacheByScopeKey.set(key, { version, preloader });
  return preloader;
}
