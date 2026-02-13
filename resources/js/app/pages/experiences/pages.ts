import { definePageRegistry } from '@/app/pages/registryHelpers';

export const experiencesPages = definePageRegistry({
  'experiences/admin/Create': () => import('./admin/create/page'),
  'experiences/admin/Edit': () => import('./admin/edit/page'),
  'experiences/admin/Index': () => import('./admin/index/page'),
});
