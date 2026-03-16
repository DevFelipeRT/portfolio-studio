import { pageRegistry } from '@/app/pages/pageRegistryProvider';
import type { PageModuleLoader } from '../types';

/**
 * The shell-facing accessor for the application page registry.
 */
export function getPageRegistry(): Record<string, PageModuleLoader> {
  return pageRegistry;
}
