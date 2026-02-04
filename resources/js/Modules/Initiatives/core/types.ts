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
    locale: string;
    name: string;
    summary: string | null;
    description: string | null;
    display: boolean;
    start_date: string | null;
    end_date: string | null;
    images?: InitiativeImage[];
}

export interface InitiativeTranslationItem extends HasTimestamps {
    id: number;
    initiative_id: number;
    locale: string;
    name: string | null;
    summary: string | null;
    description: string | null;
}
