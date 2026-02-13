import { definePageRegistry } from '@/app/pages/registryHelpers';

export const contactChannelsPages = definePageRegistry({
  'contact-channels/admin/Create': () => import('./admin/create/page'),
  'contact-channels/admin/Edit': () => import('./admin/edit/page'),
  'contact-channels/admin/Index': () => import('./admin/index/page'),
});
