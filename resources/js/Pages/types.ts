import type { Image } from '@/Modules/Images/core/types';

export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
}

export interface Skill extends HasTimestamps {
    id: number;
    name: string;
    category?: SkillCategory | null;
    skill_category_id?: number | null;
}

export interface SkillGroup {
    id: string;
    title: string;
    skills: Skill[];
}

export interface SkillCategory extends HasTimestamps {
    id: number;
    name: string;
    slug: string;
}

/**
 * Image as used in the project domain, including relation metadata.
 */
export interface ProjectImage extends Image {
    position: number;
    is_cover: boolean;
    caption: string | null;
}

/**
 * Image as used in the initiative domain, including relation metadata.
 */
export interface InitiativeImage extends Image {
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

export interface Experience extends HasTimestamps {
    id: number;
    position: string;
    company: string;
    short_description: string;
    long_description: string;
    start_date: string;
    end_date: string | null;
    display: boolean;
}

export interface Course extends HasTimestamps {
    id: number;
    name: string;
    institution: string;
    category: string;
    status: string;
    summary: string;
    description: string;
    started_at: string;
    completed_at: string | null;
    display: boolean;
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
