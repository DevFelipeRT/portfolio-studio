import { PageRegistryProvider } from '@/app/pages/pageRegistryProvider';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'courses/admin/Create': () => import('./admin/create/page'),
  'courses/admin/Edit': () => import('./admin/edit/page'),
  'courses/admin/Index': () => import('./admin/index/page'),
  });
}
