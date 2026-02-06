export type InitiativeImageInput = {
    file: File | null;
    alt?: string;
};

export type InitiativeFormData = {
    locale: string;
    confirm_swap?: boolean;
    name: string;
    summary: string;
    description: string;
    display: boolean;
    start_date: string | null;
    end_date: string | null;
    images: InitiativeImageInput[];
};
