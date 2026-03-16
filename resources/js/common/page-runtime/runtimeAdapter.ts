import type { PageRuntimeAdapter } from './types';
import { createInertiaAdapter } from './adapters/inertia';

let adapter: PageRuntimeAdapter | null = null;

export function getPageRuntimeAdapter(): PageRuntimeAdapter {
  if (adapter === null) {
    adapter = createInertiaAdapter();
  }

  return adapter;
}
