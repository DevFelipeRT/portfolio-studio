import { PageRegistryProvider } from '@/app/pages/PageRegistryProvider';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'dashboard/admin/Dashboard': () => import('./admin/dashboard/page'),
  });
}
