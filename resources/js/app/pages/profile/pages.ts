import { PageRegistryProvider } from '@/app/pages/pageRegistryProvider';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'profile/admin/Edit': () => import('./admin/edit/page'),
  });
}
