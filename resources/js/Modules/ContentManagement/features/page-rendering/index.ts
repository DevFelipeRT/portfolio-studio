export type {
  SectionComponentProps,
  SectionComponentRegistry,
  SectionRegistryProvider,
} from '@/Modules/ContentManagement/features/page-rendering/registry/sectionRegistry';

export { SECTION_COMPONENT_REGISTRY } from '@/Modules/ContentManagement/features/page-rendering/registry/sectionRegistry';

export { contentManagementSectionRegistryProvider } from '@/Modules/ContentManagement/features/page-rendering/registry/sectionRegistryProvider';

export type { StringNormalizer } from '@/Modules/ContentManagement/features/page-rendering/rules/ports/stringNormalizer';

export type { SectionEnvironment } from '@/Modules/ContentManagement/features/page-rendering/runtime/sectionEnvironment';
export {
  SectionEnvironmentProvider,
  useSectionEnvironment,
} from '@/Modules/ContentManagement/features/page-rendering/runtime/useSectionEnvironment';

export {
  SectionFieldResolverProvider,
  useSectionFieldResolver,
} from '@/Modules/ContentManagement/features/page-rendering/runtime/useSectionFieldResolver';

export { SectionHeader } from '@/Modules/ContentManagement/features/page-rendering/components/partials/SectionHeader';

export { SectionRenderer } from '@/Modules/ContentManagement/features/page-rendering/rendering/SectionRenderer';
export { sectionSlotLayoutManager } from '@/Modules/ContentManagement/features/page-rendering/rendering/SectionSlotLayout';

export { buildInitialSectionData } from '@/Modules/ContentManagement/features/page-rendering/rules/sectionDataFactory';
export {
  buildNavigationItemsFromSections,
  getSectionNavigationGroup,
  getSectionNavigationLabel,
} from '@/Modules/ContentManagement/features/page-rendering/rules/sectionNavigation';
export { collectSectionNavigationGroups } from '@/Modules/ContentManagement/features/page-rendering/rules/sectionNavigationGroups';
export { sortSectionsByPosition } from '@/Modules/ContentManagement/features/page-rendering/rules/sectionSort';
