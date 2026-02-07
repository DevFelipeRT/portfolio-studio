export type {
    SectionComponentProps,
    SectionComponentRegistry,
    SectionRegistryProvider,
} from '@/Modules/ContentManagement/features/sections/registry/sectionRegistry';

export { SECTION_COMPONENT_REGISTRY } from '@/Modules/ContentManagement/features/sections/registry/sectionRegistry';

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
