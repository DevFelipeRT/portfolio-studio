export type CourseFormData = {
    locale: string;
    name: string;
    institution: string;
    category: string;
    summary: string;
    description: string;
    started_at: string | null;
    completed_at: string | null;
    display: boolean;
};
