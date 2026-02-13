import { PageRegistryProvider } from '@/app/pages/pageRegistryProvider';

export function registerPages(provider: PageRegistryProvider): void {
  provider.registerMany({
  'content-management/admin/PageCreate': () => import('./admin/page-create/page'),
  'content-management/admin/PageEdit': () => import('./admin/page-edit/page'),
  'content-management/admin/PageIndex': () => import('./admin/page-index/page'),
  'content-management/public/RenderedPage': () =>
    import('./public/rendered-page/page'),
  });
}
