import { definePageRegistry } from '@/app/pages/registryHelpers';

export const initiativesPages = definePageRegistry({
  'initiatives/admin/Create': () => import('./admin/create/page'),
  'initiatives/admin/Edit': () => import('./admin/edit/page'),
  'initiatives/admin/Index': () => import('./admin/index/page'),
});
