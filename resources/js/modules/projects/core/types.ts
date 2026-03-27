import type { ProjectStatusValue } from '@/modules/projects/core/status';
import type { Image } from '@/modules/images/core/types';
import type { Skill } from '@/modules/skills/core/types';

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
    alt?: string | null;
    title?: string | null;
    src?: string | null;
}

export interface ProjectSkillItem {
    id: number;
    name: string;
}

export interface Project extends HasTimestamps {
    id: number;
    locale: string;
    name: string;
    summary: string;
    description: string;
    status: ProjectStatusValue;
    repository_url: string | null;
    live_url: string | null;
    images: ProjectImage[] | null;
    skills: Skill[];
    display: boolean;
}

export interface ProjectListItem {
    id: number;
    locale: string;
    name: string;
    summary: string | null;
    status: ProjectStatusValue | null;
    display: boolean;
    image_count: number;
}

export interface ProjectDetail extends HasTimestamps {
    id: number;
    locale: string;
    name: string;
    summary: string | null;
    description: string | null;
    status: ProjectStatusValue | null;
    repository_url: string | null;
    live_url: string | null;
    images: ProjectImage[];
    skills: ProjectSkillItem[];
    display: boolean;
}

export interface ProjectTranslationItem extends HasTimestamps {
    id: number;
    project_id: number;
    locale: string;
    name: string | null;
    summary: string | null;
    description: string | null;
    status: ProjectStatusValue | null;
    repository_url: string | null;
    live_url: string | null;
}
