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
import type { Course } from '@/Modules/Courses/core/types';

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
    Course,
};

