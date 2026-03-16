import {
  getPageRegistry,
  PageRegistryProvider,
  type PageRegistryManifest,
} from '@/app/shell';

export { PageRegistryProvider, type PageRegistryManifest };

export const pageRegistry = getPageRegistry();
