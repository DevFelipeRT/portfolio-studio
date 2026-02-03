import type { Image } from '@/Modules/Images/core/types';
import type { Skill } from '@/Modules/Skills/core/types';

export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
}

/**
 * Image as used in the project domain, including relation metadata.
 */
export interface ProjectImage extends Image {
    position: number;
    is_cover: boolean;
    caption: string | null;
}

export interface Project extends HasTimestamps {
    id: number;
    locale: string;
    name: string;
    summary: string;
    description: string;
    status: string;
    repository_url: string | null;
    live_url: string | null;
    images: ProjectImage[] | null;
    skills: Skill[];
    display: boolean;
}

export interface ProjectTranslationItem extends HasTimestamps {
    id: number;
    project_id: number;
    locale: string;
    name: string | null;
    summary: string | null;
    description: string | null;
    repository_url: string | null;
    live_url: string | null;
}
