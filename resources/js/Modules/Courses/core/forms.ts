export type CourseFormData = {
    locale: string;
    confirm_swap?: boolean;
    name: string;
    institution: string;
    category: string;
    summary: string;
    description: string;
    started_at: string | null;
    completed_at: string | null;
    display: boolean;
};
