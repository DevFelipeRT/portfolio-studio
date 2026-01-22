import type { Image } from '@/Modules/Images/core/types';

export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
}

/**
 * Image as used in the initiative domain, including relation metadata.
 */
export interface InitiativeImage extends Image {
    position: number;
    is_cover: boolean;
    caption: string | null;
    alt?: string | null;
    title?: string | null;
    src?: string | null;
}

export interface Initiative extends HasTimestamps {
    id: number;
    name: string;
    short_description: string;
    long_description: string;
    display: boolean;
    start_date: string | null;
    end_date: string | null;
    images?: InitiativeImage[];
}
