import type { Image } from '@/Modules/Images/core/types';
import type {
    Skill,
    SkillCategory,
    SkillGroup,
} from '@/Modules/Skills/core/types';
import type { Project, ProjectImage } from '@/Modules/Projects/core/types';

export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
}

export type { Skill, SkillCategory, SkillGroup, Project, ProjectImage };

/**
 * Image as used in the initiative domain, including relation metadata.
 */
export interface InitiativeImage extends Image {
    position: number;
    is_cover: boolean;
    caption: string | null;
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
