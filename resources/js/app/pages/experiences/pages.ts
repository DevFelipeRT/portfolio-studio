import { PageRegistryProvider } from '@/app/pages/PageRegistryProvider';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'experiences/admin/Create': () => import('./admin/create/page'),
  'experiences/admin/Edit': () => import('./admin/edit/page'),
  'experiences/admin/Index': () => import('./admin/index/page'),
  });
}
