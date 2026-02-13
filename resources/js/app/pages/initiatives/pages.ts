import { PageRegistryProvider } from '@/app/pages/pageRegistryProvider';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'initiatives/admin/Create': () => import('./admin/create/page'),
  'initiatives/admin/Edit': () => import('./admin/edit/page'),
  'initiatives/admin/Index': () => import('./admin/index/page'),
  });
}
