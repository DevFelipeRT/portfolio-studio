import { PageRegistryProvider } from '@/app/pages/PageRegistryProvider';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'contact-channels/admin/Create': () => import('./admin/create/page'),
  'contact-channels/admin/Edit': () => import('./admin/edit/page'),
  'contact-channels/admin/Index': () => import('./admin/index/page'),
  });
}
