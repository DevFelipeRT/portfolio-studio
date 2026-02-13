export type {
  SectionComponentProps,
  SectionComponentRegistry,
  SectionRenderModel,
  SectionRegistryProvider,
} from '@/modules/content-management/features/page-rendering/types';
export type { ComponentRegistryProvider } from '@/modules/content-management/types/provider';

export { contentManagementSectionRegistryProvider } from '@/modules/content-management/features/page-rendering/template/registry/componentRegistryProvider';

export type { StringNormalizer } from '@/modules/content-management/types/strings';

export type {
  PageRenderingContext,
  PageRenderingContextContributor,
  PageRenderingContextNamespaces,
  PageRenderingContextValue,
} from '@/modules/content-management/features/page-rendering/rendering';
export {
  buildPageRenderingContext,
  PageRenderingContextProvider,
  SectionRenderer,
  sectionSlotLayoutManager,
  usePageRenderingContext,
  usePageRenderingContextValue,
} from '@/modules/content-management/features/page-rendering/rendering';

export {
  FieldValueResolverProvider,
} from '@/modules/content-management/features/page-rendering/rendering/section-renderer/field-value/FieldValueResolverProvider';
export {
  useFieldValueResolver,
} from '@/modules/content-management/features/page-rendering/rendering/section-renderer/field-value/useFieldValueResolver';

export { SectionHeader } from '@/modules/content-management/features/page-rendering/template/components/partials/SectionHeader';

export { buildNavigationItems } from '@/modules/content-management/features/page-rendering/navigation';
// Sorting is an internal implementation detail of page-rendering.
