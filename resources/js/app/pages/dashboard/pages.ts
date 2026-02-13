import { definePageRegistry } from '@/app/pages/registryHelpers';

export const dashboardPages = definePageRegistry({
  'dashboard/admin/Dashboard': () => import('./admin/dashboard/page'),
});
