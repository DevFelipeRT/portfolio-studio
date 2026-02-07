export type SectionDataPrimitive = string | number | boolean | null;

/**
 * Media/image shape used by section templates.
 */
export type SectionImage = {
    id: number;
    url: string;
    alt: string | null;
    title: string | null;
    caption: string | null;
    position: number | null;
    is_cover: boolean;
    owner_caption: string | null;
};

/**
 * Represents a single item in a collection-valued field.
 *
 * Each item is a record of section data values, allowing nested collections
 * when needed.
 */
export interface SectionDataCollectionItem {
    [key: string]: SectionDataValue;
}

/**
 * Represents any supported value for a section data field.
 *
 * Fields can hold primitives, arrays of primitives or collections of objects.
 */
export type SectionDataValue =
    | SectionDataPrimitive
    | SectionDataPrimitive[]
    | SectionDataCollectionItem[]
    | SectionImage
    | SectionImage[]
    | null;

export type SectionData = Record<string, SectionDataValue>;

