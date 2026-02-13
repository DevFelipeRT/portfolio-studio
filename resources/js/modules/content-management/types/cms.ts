import type { SectionData } from '@/modules/content-management/types/sections';
import type { TemplateDefinitionDto } from '@/modules/content-management/types/templates';

export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
}

/**
 * Describes a content-managed page as exposed by the backend DTO.
 */
export interface PageDto extends HasTimestamps {
    id: number;

    slug: string;
    internal_name: string;
    title: string;

    meta_title: string | null;
    meta_description: string | null;
    meta_image_url: string | null;

    layout_key: string | null;
    locale: string;

    is_published: boolean;
    published_at: string | null;

    is_indexable: boolean;
}

/**
 * Describes a single content section that belongs to a page.
 */
export interface PageSectionDto extends HasTimestamps {
    id: number;
    page_id: number;

    template_key: string;
    slot: string | null;

    position: number | null;
    anchor: string | null;
    navigation_label: string | null;

    data: SectionData;

    is_active: boolean;
    visible_from: string | null;
    visible_until: string | null;

    locale: string | null;
}

/**
 * Represents a pagination navigation link element.
 */
export interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

/**
 * Represents a Laravel length-aware paginator payload for a given item type.
 */
export interface Paginated<TItem> {
    data: TItem[];
    current_page: number;
    per_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    path: string;
    links: PaginatorLink[];
}

/**
 * Props contract for the administrative page index screen.
 */
export interface PageIndexViewModelProps {
    pages: Paginated<PageDto>;
    filters: Record<string, unknown>;
    extra: Record<string, unknown>;
}

/**
 * Props contract for the administrative page edit screen.
 */
export interface PageEditViewModelProps {
    page: PageDto;
    sections: PageSectionDto[];
    availableTemplates: TemplateDefinitionDto[];
    extra: Record<string, unknown>;
}

/**
 * Props contract for the public rendered page screen.
 */
export interface PageRenderViewModelProps {
    page: PageDto;
    sections: PageSectionDto[];
    extra: {
        templates?: TemplateDefinitionDto[];
        [key: string]: unknown;
    };
}
