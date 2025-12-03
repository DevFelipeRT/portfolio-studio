export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
}

export interface Technology extends HasTimestamps {
    id: number;
    name: string;
    category: string;
}

export interface TechnologyGroup {
    id: string;
    title: string;
    technologies: Technology[];
};

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
    category: string;
    status: string;
    summary: string;
    description: string;
    started_at: string;
    completed_at: string | null;
    display: boolean;
}

export interface InitiativeImage extends HasTimestamps {
    id: number;
    initiative_id: number;
    src: string;
    alt: string | null;
}

export interface Initiative extends HasTimestamps {
    id: number;
    name: string;
    short_description: string;
    long_description: string;
    display: boolean;
    start_date: string | null;
    end_date: string | null;
    images?: InitiativeImage[];
}
