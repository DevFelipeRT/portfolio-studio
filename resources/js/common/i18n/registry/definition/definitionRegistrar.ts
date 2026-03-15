import { definitionLoaders } from './definitionLoaders';
import type { DefinitionRegistrar } from '../types';

/**
 * Creates a registrar that imports definition modules at most once and relies
 * on their side effects to register i18n definitions.
 */
export function createDefinitionRegistrar(): DefinitionRegistrar {
  let loaded = false;
  let loading: Promise<void> | null = null;

  return {
    /**
     * Imports all definition modules once and reuses the same in-flight
     * registration promise for concurrent callers.
     */
    async registerDefinitionsOnce(): Promise<void> {
      if (loaded) {
        return;
      }

      if (loading) {
        return loading;
      }

      loading = Promise.all(definitionLoaders.map((load) => load()))
        .then(() => {
          loaded = true;
        })
        .finally(() => {
          loading = null;
        });

      return loading;
    },
  };
}
