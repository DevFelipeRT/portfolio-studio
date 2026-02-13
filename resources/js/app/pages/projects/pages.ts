import { definePageRegistry } from '@/app/pages/registryHelpers';

export const projectsPages = definePageRegistry({
  'projects/admin/Create': () => import('./admin/create/page'),
  'projects/admin/Edit': () => import('./admin/edit/page'),
  'projects/admin/Index': () => import('./admin/index/page'),
});
