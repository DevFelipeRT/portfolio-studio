import { PageRegistryProvider } from '@/app/pages/pageRegistryProvider';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'website-settings/admin/Edit': () => import('./admin/edit/page'),
  });
}
