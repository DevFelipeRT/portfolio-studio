import type { RuntimePage } from '../types';
import { getPageRuntimeAdapter } from '../runtimeAdapter';

export function useCurrentPage(): RuntimePage {
  return getPageRuntimeAdapter().useCurrentPage();
}
