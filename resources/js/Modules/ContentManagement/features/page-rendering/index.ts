export type {
  SectionComponentProps,
  SectionComponentRegistry,
  SectionRenderModel,
  SectionRegistryProvider,
} from '@/Modules/ContentManagement/features/page-rendering/types';
export type { ComponentRegistryProvider } from '@/Modules/ContentManagement/types/provider';

export { contentManagementSectionRegistryProvider } from '@/Modules/ContentManagement/features/page-rendering/template/registry/componentRegistryProvider';

export type { StringNormalizer } from '@/Modules/ContentManagement/types/strings';

export type {
  PageRenderingContext,
  PageRenderingContextContributor,
  PageRenderingContextNamespaces,
  PageRenderingContextValue,
} from '@/Modules/ContentManagement/features/page-rendering/rendering';
export {
  buildPageRenderingContext,
  PageRenderingContextProvider,
  SectionRenderer,
  sectionSlotLayoutManager,
  usePageRenderingContext,
  usePageRenderingContextValue,
} from '@/Modules/ContentManagement/features/page-rendering/rendering';

export {
  SectionFieldResolverProvider,
} from '@/Modules/ContentManagement/features/page-rendering/runtime/sectionFieldResolverProvider';
export {
  useSectionFieldResolver,
} from '@/Modules/ContentManagement/features/page-rendering/runtime/useSectionFieldResolver';

export { SectionHeader } from '@/Modules/ContentManagement/features/page-rendering/template/components/partials/SectionHeader';

export { buildNavigationItems } from '@/Modules/ContentManagement/features/page-rendering/navigation';
// Sorting is an internal implementation detail of page-rendering.
