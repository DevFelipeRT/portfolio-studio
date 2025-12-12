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
}

/**
 * Base image representation aligned with the backend Image model and mappers.
 * Used both in global contexts (Images/Index) and as the base for domain-specific images.
 */
export interface Image extends HasTimestamps {
    id: number;

    /**
     * Storage metadata.
     */
    storage_disk: string | null;
    storage_path: string | null;
    original_filename: string | null;
    mime_type: string | null;
    file_size_bytes: number | null;
    image_width: number | null;
    image_height: number | null;

    /**
     * Presentation metadata.
     */
    alt_text: string | null;
    image_title: string | null;
    caption: string | null;

    /**
     * Resolved public URL provided by the backend.
     */
    url: string | null;
}

/**
 * Image as used in the project domain, including relation metadata.
 */
export interface ProjectImage extends Image {
    position: number;
    is_cover: boolean;
    caption: string | null;
}

/**
 * Image as used in the initiative domain, including relation metadata.
 */
export interface InitiativeImage extends Image {
    position: number;
    is_cover: boolean;
    caption: string | null;
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
