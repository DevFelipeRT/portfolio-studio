import { definePageRegistry } from '@/app/pages/registryHelpers';

export const imagesPages = definePageRegistry({
  'images/admin/Create': () => import('./admin/create/page'),
  'images/admin/Edit': () => import('./admin/edit/page'),
  'images/admin/Index': () => import('./admin/index/page'),
});
