import type { PageModuleLoader, PageRegistry } from '@/app/types';

export class PageRegistryProvider {
  private readonly registry: PageRegistry = {};

  register(name: string, loader: PageModuleLoader): void {
    if (this.registry[name]) {
      throw new Error(`Duplicate page key in registry: ${name}`);
    }

    this.registry[name] = loader;
  }

  registerMany(entries: PageRegistry): void {
    Object.entries(entries).forEach(([name, loader]) => {
      this.register(name, loader);
    });
  }

  getRegistry(): PageRegistry {
    return { ...this.registry };
  }
}

export type PageRegistryManifest = {
  registerPages: (provider: PageRegistryProvider) => void;
};

const manifests = import.meta.glob<PageRegistryManifest>('./*/pages.ts', {
  eager: true,
});

const provider = new PageRegistryProvider();

Object.values(manifests).forEach((manifest) => {
  manifest.registerPages(provider);
});

export const pageRegistry = provider.getRegistry();
