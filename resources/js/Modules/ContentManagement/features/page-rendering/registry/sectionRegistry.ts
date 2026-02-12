import { sectionRegistryProviders } from '@/config/sectionRegistryProviders';
import { buildSectionRegistry } from './sectionRegistryBuilder';

/**
 * Registry that maps template keys to specialized section components.
 */
export const SECTION_COMPONENT_REGISTRY = buildSectionRegistry(
  {},
  sectionRegistryProviders,
);
