export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
}

export interface Experience extends HasTimestamps {
    id: number;
    locale: string;
    position: string;
    company: string | null;
    summary: string | null;
    description: string;
    start_date: string;
    end_date: string | null;
    display: boolean;
}

export interface ExperienceTranslationItem extends HasTimestamps {
    id: number;
    experience_id: number;
    locale: string;
    position: string | null;
    company: string | null;
    summary: string | null;
    description: string | null;
}
