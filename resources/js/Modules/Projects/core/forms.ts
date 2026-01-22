export type ImageInput = {
    file: File | null;
    alt?: string;
};

export type ProjectFormData = {
    name: string;
    short_description: string;
    long_description: string;
    status: string;
    repository_url: string;
    live_url: string;
    display: boolean;
    skill_ids: number[];
    images: ImageInput[];
};
