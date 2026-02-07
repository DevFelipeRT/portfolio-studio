export type {
    SectionComponentProps,
    SectionComponentRegistry,
    SectionRegistryProvider,
} from '@/Modules/ContentManagement/features/sections/registry/sectionRegistry';

export { SECTION_COMPONENT_REGISTRY } from '@/Modules/ContentManagement/features/sections/registry/sectionRegistry';

export { contentManagementSectionRegistryProvider } from '@/Modules/ContentManagement/features/sections/registry/sectionRegistryProvider';

export type { StringNormalizer } from '@/Modules/ContentManagement/features/sections/ports/stringNormalizer';

export {
    SectionEnvironmentProvider,
    useSectionEnvironment,
} from '@/Modules/ContentManagement/features/sections/runtime/useSectionEnvironment';
export type { SectionEnvironment } from '@/Modules/ContentManagement/features/sections/runtime/sectionEnvironment';

export {
    SectionFieldResolverProvider,
    useSectionFieldResolver,
} from '@/Modules/ContentManagement/features/sections/runtime/useSectionFieldResolver';

export { SectionHeader } from '@/Modules/ContentManagement/features/sections/ui/components/SectionHeader';

export { SectionRenderer } from '@/Modules/ContentManagement/features/sections/rendering/SectionRenderer';
export { sectionSlotLayoutManager } from '@/Modules/ContentManagement/features/sections/rendering/SectionSlotLayout';

export { buildInitialSectionData } from '@/Modules/ContentManagement/features/sections/lib/sectionDataFactory';
export { sortSectionsByPosition } from '@/Modules/ContentManagement/features/sections/lib/sectionSort';
export {
    buildNavigationItemsFromSections,
    getSectionNavigationGroup,
    getSectionNavigationLabel,
} from '@/Modules/ContentManagement/features/sections/lib/sectionNavigation';
export { collectSectionNavigationGroups } from '@/Modules/ContentManagement/features/sections/lib/sectionNavigationGroups';
export { validateHeroFirstOrder } from '@/Modules/ContentManagement/features/sections/lib/sectionOrder';
