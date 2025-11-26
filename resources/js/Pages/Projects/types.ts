type ImageInput = {
    file: File | null;
    alt?: string;
};

type ProjectFormData = {
    name: string;
    short_description: string;
    long_description: string;
    status: string;
    repository_url: string;
    live_url: string;
    display: boolean;
    technology_ids: number[];
    images: ImageInput[];
};
