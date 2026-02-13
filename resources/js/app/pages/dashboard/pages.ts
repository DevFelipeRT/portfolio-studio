import { PageRegistryProvider } from '@/app/pages/pageRegistryProvider';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'dashboard/admin/Dashboard': () => import('./admin/dashboard/page'),
  });
}
