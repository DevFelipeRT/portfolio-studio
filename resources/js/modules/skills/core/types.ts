export interface HasTimestamps {
  created_at: string | null;
  updated_at: string | null;
}

export interface TranslationItem extends HasTimestamps {
  id: number;
  locale: string;
  name: string;
}

export interface SkillCategorySummary {
  id: number;
  name: string;
}

export interface AdminSkillListItem extends HasTimestamps {
  id: number;
  name: string;
  locale: string;
  skill_category_id: number | null;
  category: SkillCategorySummary | null;
}

export interface AdminSkillCategoryRecord extends HasTimestamps {
  id: number;
  name: string;
  slug: string;
  locale: string;
}

export interface SkillCatalogItem extends HasTimestamps {
  id: number;
  name: string;
  skill_category_id: number | null;
  category: SkillCategorySummary | null;
}
