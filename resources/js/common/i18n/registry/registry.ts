import type { I18nPreloader, I18nRegistry } from '../types';
import { createDefinitionRegistrar } from './definition/definitionRegistrar';
import { createRegistryState } from './registryState';

let singleton: I18nRegistry | null = null;

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

  const registryState = createRegistryState();
  const definitionsLoader = createDefinitionRegistrar();

  /**
   * Reports unknown registry ids during development.
   */
  function reportUnknown(id: string): void {
    if (!import.meta.env.DEV) {
      return;
    }

    // eslint-disable-next-line no-console
    console.warn(
      `[i18n] Unknown registry id "${id}". Check for typos or ensure it is defined.`,
    );
  }

  /**
   * Ensures that the requested scope ids have registered preloaders available
   * in the registry state.
   */
  async function ensureRegistered(ids: readonly string[]): Promise<void> {
    await definitionsLoader.registerDefinitionsOnce();

    await Promise.all(
      ids.map(async (id) => {
        if (registryState.hasPreloader(id)) {
          return;
        }

        const loader = registryState.getLoader(id);
        if (!loader) {
          reportUnknown(id);
          return;
        }

        const existingPromise = registryState.getLoadPromise(id);
        if (existingPromise) {
          await existingPromise;
          return;
        }

        const promise = Promise.resolve()
          .then(async () => {
            await loader();
          })
          .finally(() => {
            registryState.clearLoadPromise(id);
          });

        registryState.setLoadPromise(id, promise);
        await promise;

        if (!registryState.hasPreloader(id) && import.meta.env.DEV) {
          throw new Error(
            `[i18n] Loader for "${id}" ran, but no preloader was registered.`,
          );
        }
      }),
    );
  }

  const registry: I18nRegistry = {
    register(id: string, preloader: I18nPreloader) {
      registryState.register(id, preloader);
    },

    define(id: string, load: () => Promise<unknown>) {
      registryState.define(id, load);
    },

    ensureRegistered(ids: readonly string[]) {
      return ensureRegistered(ids);
    },

    getPreloader(id: string) {
      return registryState.getPreloader(id);
    },

    getAllPreloaders() {
      return registryState.getAllPreloaders();
    },

    getVersion() {
      return registryState.getVersion();
    },
  };

  // Allow definition modules to call back into `createI18nRegistry()` during bootstrap.
  singleton = registry;

  return registry;
}
