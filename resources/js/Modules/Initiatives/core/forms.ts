export type InitiativeImageInput = {
    file: File | null;
    alt?: string;
};

export type InitiativeFormData = {
    name: string;
    short_description: string;
    long_description: string;
    display: boolean;
    start_date: string | null;
    end_date: string | null;
    images: InitiativeImageInput[];
};
