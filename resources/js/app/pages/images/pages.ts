import { PageRegistryProvider } from '@/app/pages/PageRegistryProvider';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'images/admin/Create': () => import('./admin/create/page'),
  'images/admin/Edit': () => import('./admin/edit/page'),
  'images/admin/Index': () => import('./admin/index/page'),
  });
}
