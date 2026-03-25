export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
}

export interface Course {
    id: number;
    locale: string;
    name: string;
    institution: string | null;
    category: string;
    status: string;
    summary: string | null;
    description: string | null;
    started_at: string | null;
    completed_at: string | null;
    display: boolean;
    updated_at: string | null;
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
