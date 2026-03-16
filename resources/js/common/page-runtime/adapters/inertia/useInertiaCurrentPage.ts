import { usePage } from '@inertiajs/react';
import type { RuntimePage } from '../../types';

export function useInertiaCurrentPage(): RuntimePage {
  const page = usePage();

  return {
    component: page.component,
    props: page.props,
    url: page.url,
    version: page.version ?? null,
  };
}
