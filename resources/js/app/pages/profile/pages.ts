import { definePageRegistry } from '@/app/pages/registryHelpers';

export const profilePages = definePageRegistry({
  'profile/admin/Edit': () => import('./admin/edit/page'),
});
