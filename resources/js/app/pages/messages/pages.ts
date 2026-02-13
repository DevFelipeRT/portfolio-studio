import { PageRegistryProvider } from '@/app/pages/pageRegistryProvider';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'messages/admin/Index': () => import('./admin/index/page'),
  });
}
