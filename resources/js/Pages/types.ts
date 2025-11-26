export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
}

export interface Technology extends HasTimestamps {
    id: number;
    name: string;
}

export interface ProjectImage extends HasTimestamps {
    id: number;
    src: string;
    alt: string;
}

export interface Project extends HasTimestamps {
    id: number;
    name: string;
    short_description: string;
    long_description: string;
    status: string;
    repository_url: string | null;
    live_url: string | null;
    images: ProjectImage[] | null;
    technologies: Technology[];
    display: boolean;
}

export interface Experience extends HasTimestamps {
    id: number;
    position: string;
    company: string;
    short_description: string;
    long_description: string;
    start_date: string;
    end_date: string | null;
    display: boolean;
}

export interface Course extends HasTimestamps {
    id: number;
    name: string;
    institution: string;
    short_description: string;
    long_description: string;
    start_date: string;
    end_date: string | null;
    display: boolean;
}
