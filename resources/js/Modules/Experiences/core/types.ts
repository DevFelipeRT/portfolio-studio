export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
}

export interface Experience extends HasTimestamps {
    id: number;
    position: string;
    company: string;
    summary: string | null;
    description: string;
    start_date: string;
    end_date: string | null;
    display: boolean;
}
