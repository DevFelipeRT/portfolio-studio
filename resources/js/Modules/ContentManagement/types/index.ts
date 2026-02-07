// Backwards-compatible re-exports. Prefer importing from:
//   "@/Modules/ContentManagement/shared/types/*"

export type {
    HasTimestamps,
    PageDto,
    PageSectionDto,
    Paginated,
    PaginatorLink,
    PageEditViewModelProps,
    PageIndexViewModelProps,
    PageRenderViewModelProps,
} from '@/Modules/ContentManagement/shared/types/cms';

export type {
    SectionData,
    SectionDataCollectionItem,
    SectionDataPrimitive,
    SectionDataValue,
    SectionImage,
} from '@/Modules/ContentManagement/shared/types/sections';

export type {
    TemplateDefinitionDto,
    TemplateFieldDto,
    TemplateFieldPrimitiveType,
} from '@/Modules/ContentManagement/shared/types/templates';
