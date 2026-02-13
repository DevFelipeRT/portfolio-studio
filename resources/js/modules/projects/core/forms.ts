export type ImageInput = {
    file: File | null;
    alt?: string;
};

export type ProjectFormData = {
    locale: string;
    confirm_swap?: boolean;
    name: string;
    summary: string;
    description: string;
    status: string;
    repository_url: string;
    live_url: string;
    display: boolean;
    skill_ids: number[];
    images: ImageInput[];
};
