import { PageRegistryProvider } from '@/app/pages/pageRegistryProvider';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'skills/admin/Create': () => import('./admin/create/page'),
  'skills/admin/Edit': () => import('./admin/edit/page'),
  'skills/admin/Index': () => import('./admin/index/page'),
  'skills/admin/skill-categories/Create': () =>
    import('./admin/skill-categories/create/page'),
  'skills/admin/skill-categories/Edit': () =>
    import('./admin/skill-categories/edit/page'),
  });
}
