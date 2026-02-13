import { definePageRegistry } from '@/app/pages/registryHelpers';

export const messagesPages = definePageRegistry({
  'messages/admin/Index': () => import('./admin/index/page'),
});
