import type { Locale } from '@/common/locale';
import { I18nPreloader, I18nRegistry } from '../types';
import { normalizeScope } from './scopeNormalizer';

let singleton: I18nRegistry | null = null;

function scopeKey(scope: readonly string[] | null): string {
  return scope ? scope.join('|') : '*';
}

/**
 * Factory for the i18n registry (singleton).
 *
 * Returning a singleton keeps module-level registrations consistent across the
 * application without requiring a central bootstrap import.
 */
export function createI18nRegistry(): I18nRegistry {
  if (singleton) {
    return singleton;
  }

  const preloadersById = new Map<string, I18nPreloader>();
  const loadersById = new Map<string, () => Promise<unknown>>();
  const loadPromisesById = new Map<string, Promise<void>>();
  let version = 0;

  type CacheEntry = {
    version: number;
    preloader: I18nPreloader;
  };

  const cacheByScopeKey = new Map<string, CacheEntry>();

  const definitionImporters: Array<() => Promise<unknown>> = [
    ...Object.values(import.meta.glob('../../../modules/*/i18n/definition.ts')),
    ...Object.values(
      import.meta.glob('../../../app/layouts/i18n/definition.ts'),
    ),
  ];

  let definitionsLoaded = false;
  let definitionsLoading: Promise<void> | null = null;

  async function loadDefinitionsOnce(): Promise<void> {
    if (definitionsLoaded) {
      return;
    }

    if (definitionsLoading) {
      return definitionsLoading;
    }

    definitionsLoading = Promise.all(definitionImporters.map((load) => load()))
      .then(() => {
        definitionsLoaded = true;
      })
      .finally(() => {
        definitionsLoading = null;
      });

    return definitionsLoading;
  }

  function reportUnknown(id: string): void {
    if (!import.meta.env.DEV) {
      return;
    }

    // eslint-disable-next-line no-console
    console.warn(
      `[i18n] Unknown registry id "${id}". Check for typos or ensure it is defined.`,
    );
  }

  async function ensureRegistered(ids: readonly string[]): Promise<void> {
    await loadDefinitionsOnce();

    await Promise.all(
      ids.map(async (id) => {
        if (preloadersById.has(id)) {
          return;
        }

        const loader = loadersById.get(id);
        if (!loader) {
          reportUnknown(id);
          return;
        }

        const existingPromise = loadPromisesById.get(id);
        if (existingPromise) {
          await existingPromise;
          return;
        }

        const promise = Promise.resolve()
          .then(async () => {
            await loader();
          })
          .finally(() => {
            loadPromisesById.delete(id);
          });

        loadPromisesById.set(id, promise);
        await promise;

        if (!preloadersById.has(id) && import.meta.env.DEV) {
          throw new Error(
            `[i18n] Loader for "${id}" ran, but no preloader was registered.`,
          );
        }
      }),
    );
  }

  const registry: I18nRegistry = {
    register(id: string, preloader: I18nPreloader) {
      const key = id.trim();
      if (!key) {
        throw new Error('[i18n] Registry id must be a non-empty string.');
      }

      const existing = preloadersById.get(key);
      if (existing === preloader) {
        return;
      }

      preloadersById.set(key, preloader);
      version += 1;
    },

    define(id: string, load: () => Promise<unknown>) {
      const key = id.trim();
      if (!key) {
        throw new Error('[i18n] Registry id must be a non-empty string.');
      }

      const existing = loadersById.get(key);
      if (existing === load) {
        return;
      }

      loadersById.set(key, load);
    },

    preloaderFor(scope?: readonly string[] | null) {
      const normalized = normalizeScope(scope);
      const key = scopeKey(normalized);

      const cached = cacheByScopeKey.get(key);
      if (cached && cached.version === version) {
        return cached.preloader;
      }

      const combined: I18nPreloader = {
        preloadLocale: async (locale: Locale) => {
          if (normalized) {
            await ensureRegistered(normalized);

            await Promise.all(
              normalized.map((id) => preloadersById.get(id)?.preloadLocale?.(locale)),
            );
            return;
          }

          await Promise.all(
            Array.from(preloadersById.values()).map((p) => p.preloadLocale?.(locale)),
          );
        },
      };

      cacheByScopeKey.set(key, { version, preloader: combined });
      return combined;
    },
  };

  // Allow definition modules to call back into `createI18nRegistry()` during bootstrap.
  singleton = registry;

  return registry;
}
