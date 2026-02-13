import type { PageModuleLoader, PageRegistry } from '@/app/types';

/**
 * Declares a domain page registry.
 *
 * This helper exists to keep domain manifests consistent and typed without
 * coupling them to the Inertia layer.
 */
export function definePageRegistry(registry: PageRegistry): PageRegistry {
  return registry;
}

export function mergePageRegistries(
  ...registries: Array<PageRegistry>
): PageRegistry {
  const merged: PageRegistry = {};

  registries.forEach((registry) => {
    Object.entries(registry).forEach(([key, loader]) => {
      if (merged[key]) {
        throw new Error(`Duplicate page key in registry: ${key}`);
      }

      merged[key] = loader as PageModuleLoader;
    });
  });

  return merged;
}

