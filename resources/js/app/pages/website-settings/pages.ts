import type { PageRegistryProvider } from '@/app/shell/registry';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'website-settings/admin/Edit': () => import('./admin/edit/page'),
  });
}
