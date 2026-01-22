export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
}

export interface SkillCategory extends HasTimestamps {
    id: number;
    name: string;
    slug: string;
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
