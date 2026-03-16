import type { PageRegistryProvider } from '@/app/shell/registry';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'messages/admin/Index': () => import('./admin/index/page'),
  });
}
