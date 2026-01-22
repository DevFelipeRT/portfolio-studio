import type {
    Skill,
    SkillCategory,
    SkillGroup,
} from '@/Modules/Skills/core/types';
import type { Project, ProjectImage } from '@/Modules/Projects/core/types';
import type {
    Initiative,
    InitiativeImage,
} from '@/Modules/Initiatives/core/types';
import type { Experience } from '@/Modules/Experiences/core/types';

export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
}

export type {
    Skill,
    SkillCategory,
    SkillGroup,
    Project,
    ProjectImage,
    Initiative,
    InitiativeImage,
    Experience,
};


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
