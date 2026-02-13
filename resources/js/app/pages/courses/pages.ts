import { definePageRegistry } from '@/app/pages/registryHelpers';

export const coursesPages = definePageRegistry({
  'courses/admin/Create': () => import('./admin/create/page'),
  'courses/admin/Edit': () => import('./admin/edit/page'),
  'courses/admin/Index': () => import('./admin/index/page'),
});
