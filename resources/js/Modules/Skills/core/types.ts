export interface HasTimestamps {
  created_at: string | null;
  updated_at: string | null;
}

export interface TranslationItem extends HasTimestamps {
  id: number;
  locale: string;
  name: string;
}

export interface SkillCategory extends HasTimestamps {
  id: number;
  name: string;
  slug: string;
  translations?: TranslationItem[];
}

export interface Skill extends HasTimestamps {
  id: number;
  name: string;
  category?: SkillCategory | null;
  skill_category_id?: number | null;
  translations?: TranslationItem[];
}

export interface SkillGroup {
  id: string;
  title: string;
  skills: Skill[];
}
