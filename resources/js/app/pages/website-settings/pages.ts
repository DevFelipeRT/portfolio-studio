import { definePageRegistry } from '@/app/pages/registryHelpers';

export const websiteSettingsPages = definePageRegistry({
  'website-settings/admin/Edit': () => import('./admin/edit/page'),
});
