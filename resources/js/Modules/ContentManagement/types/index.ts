// Centralized type exports for ContentManagement.
// Prefer importing from "@/Modules/ContentManagement/types".

export type {
    HasTimestamps,
    PageDto,
    PageSectionDto,
    Paginated,
    PaginatorLink,
    PageEditViewModelProps,
    PageIndexViewModelProps,
    PageRenderViewModelProps,
} from '@/Modules/ContentManagement/types/cms';

export type {
    SectionData,
    SectionDataCollectionItem,
    SectionDataPrimitive,
    SectionDataValue,
    SectionImage,
    TemplateData,
} from '@/Modules/ContentManagement/types/sections';

export type {
    TemplateDefinitionDto,
    TemplateFieldDto,
    TemplateFieldPrimitiveType,
} from '@/Modules/ContentManagement/types/templates';
