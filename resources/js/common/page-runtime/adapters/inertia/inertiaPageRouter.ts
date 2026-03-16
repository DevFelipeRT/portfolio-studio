import type { RequestPayload } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import type { PageRouter } from '../../types';

export const inertiaPageRouter: PageRouter = {
  visit(url, options) {
    router.visit(url, options);
  },
  get(url, data, options) {
    router.get(url, data as RequestPayload | undefined, options);
  },
  post(url, data, options) {
    router.post(url, data as RequestPayload | undefined, options);
  },
  put(url, data, options) {
    router.put(url, data as RequestPayload | undefined, options);
  },
  patch(url, data, options) {
    router.patch(url, data as RequestPayload | undefined, options);
  },
  delete(url, options) {
    router.delete(url, options);
  },
};
