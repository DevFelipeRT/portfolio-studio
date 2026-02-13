import { pageRegistry } from '@/app/pages/pageRegistryProvider';
import type { PageModuleLoader } from '../types';

/**
 * Adapter layer for resolving the Inertia page registry.
 *
 * This keeps the Inertia runtime isolated from the pages implementation details.
 */
export function getInertiaPageRegistry(): Record<string, PageModuleLoader> {
  return pageRegistry;
}
