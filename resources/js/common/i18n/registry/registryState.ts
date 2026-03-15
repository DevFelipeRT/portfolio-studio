import type { I18nPreloader } from '../types';
import type { RegistryState } from './types';

/**
 * Creates the mutable state backing the i18n registry implementation.
 */
export function createRegistryState(): RegistryState {
  const preloadersById = new Map<string, I18nPreloader>();
  const loadersById = new Map<string, () => Promise<unknown>>();
  const loadPromisesById = new Map<string, Promise<void>>();
  let version = 0;

  /**
   * Normalizes registry ids into trimmed, non-empty keys.
   */
  function normalizeId(id: string): string {
    const key = id.trim();
    if (!key) {
      throw new Error('[i18n] Registry id must be a non-empty string.');
    }

    return key;
  }

  return {
    /**
     * Stores a preloader under its normalized registry id.
     */
    register(id: string, preloader: I18nPreloader): void {
      const key = normalizeId(id);
      const existing = preloadersById.get(key);
      if (existing === preloader) {
        return;
      }

      preloadersById.set(key, preloader);
      version += 1;
    },

    /**
     * Stores a lazy loader for a normalized registry id.
     */
    define(id: string, load: () => Promise<unknown>): void {
      const key = normalizeId(id);
      const existing = loadersById.get(key);
      if (existing === load) {
        return;
      }

      loadersById.set(key, load);
    },

    /**
     * Reports whether a preloader is currently registered for the given id.
     */
    hasPreloader(id: string): boolean {
      return preloadersById.has(id);
    },

    /**
     * Returns the registered preloader for the given id, if present.
     */
    getPreloader(id: string): I18nPreloader | undefined {
      return preloadersById.get(id);
    },

    /**
     * Returns all currently registered preloaders.
     */
    getAllPreloaders(): readonly I18nPreloader[] {
      return Array.from(preloadersById.values());
    },

    /**
     * Returns the lazy loader registered for the given id, if present.
     */
    getLoader(id: string): (() => Promise<unknown>) | undefined {
      return loadersById.get(id);
    },

    /**
     * Returns the in-flight loader promise for the given id, if present.
     */
    getLoadPromise(id: string): Promise<void> | undefined {
      return loadPromisesById.get(id);
    },

    /**
     * Stores the in-flight loader promise for the given id.
     */
    setLoadPromise(id: string, promise: Promise<void>): void {
      loadPromisesById.set(id, promise);
    },

    /**
     * Removes the in-flight loader promise associated with the given id.
     */
    clearLoadPromise(id: string): void {
      loadPromisesById.delete(id);
    },

    /**
     * Returns the registry state version used for cache invalidation.
     */
    getVersion(): number {
      return version;
    },
  };
}
