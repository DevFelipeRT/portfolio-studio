// Centralized type exports for ContentManagement.
// Prefer importing from "@/modules/content-management/types".

export type {
    HasTimestamps,
    PageDto,
    PageSectionDto,
    Paginated,
    PaginatorLink,
    PageEditViewModelProps,
    PageIndexViewModelProps,
    PageRenderViewModelProps,
} from '@/modules/content-management/types/cms';

export type {
    SectionData,
    SectionDataCollectionItem,
    SectionDataPrimitive,
    SectionDataValue,
    SectionImage,
    TemplateData,
} from '@/modules/content-management/types/sections';

export type {
    TemplateDefinitionDto,
    TemplateFieldDto,
    TemplateFieldPrimitiveType,
} from '@/modules/content-management/types/templates';

export type { ComponentRegistryProvider } from '@/modules/content-management/types/provider';
