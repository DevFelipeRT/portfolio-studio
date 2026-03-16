import type { PageModuleLoader } from '@/app/types';

export class PageRegistryProvider {
  private readonly registry: Record<string, PageModuleLoader> = {};

  register(name: string, loader: PageModuleLoader): void {
    if (this.registry[name]) {
      throw new Error(`Duplicate page key in registry: ${name}`);
    }

    this.registry[name] = loader;
  }

  registerMany(entries: Record<string, PageModuleLoader>): void {
    Object.entries(entries).forEach(([name, loader]) => {
      this.register(name, loader);
    });
  }

  getRegistry(): Record<string, PageModuleLoader> {
    return { ...this.registry };
  }
}

export type PageRegistryManifest = {
  registerPages: (provider: PageRegistryProvider) => void;
};

const manifests = import.meta.glob<PageRegistryManifest>('../../pages/*/pages.ts', {
  eager: true,
});

const provider = new PageRegistryProvider();

Object.values(manifests).forEach((manifest) => {
  manifest.registerPages(provider);
});

const pageRegistry = provider.getRegistry();

/**
 * The shell-facing accessor for the application page registry.
 */
export function getPageRegistry(): Record<string, PageModuleLoader> {
  return pageRegistry;
}
