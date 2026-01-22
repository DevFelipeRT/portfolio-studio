export interface HasTimestamps {
    created_at: string | null;
    updated_at: string | null;
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
