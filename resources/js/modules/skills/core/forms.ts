export type SkillFormData = {
    name: string;
    locale: string;
    confirm_swap?: boolean;
    skill_category_id: number | '';
};

export type SkillCategoryFormData = {
    name: string;
    slug: string;
    locale: string;
    confirm_swap?: boolean;
};
