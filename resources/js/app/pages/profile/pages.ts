import type { PageRegistryProvider } from '@/app/shell/registry';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'profile/admin/Edit': () => import('./admin/edit/page'),
  });
}
