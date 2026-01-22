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
    name: string;
    short_description: string;
    long_description: string;
    status: string;
    repository_url: string | null;
    live_url: string | null;
    images: ProjectImage[] | null;
    skills: Skill[];
    display: boolean;
}
