export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
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

export interface CourseTranslationItem extends HasTimestamps {
    id: number;
    course_id: number;
    locale: string;
    name: string | null;
    institution: string | null;
    summary: string | null;
    description: string | null;
}
