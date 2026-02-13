import { PageRegistryProvider } from '@/app/pages/PageRegistryProvider';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'projects/admin/Create': () => import('./admin/create/page'),
  'projects/admin/Edit': () => import('./admin/edit/page'),
  'projects/admin/Index': () => import('./admin/index/page'),
  });
}
