import type { PageRegistryProvider } from '@/app/shell/registry';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'dashboard/admin/Dashboard': () => import('./admin/dashboard/page'),
  });
}
