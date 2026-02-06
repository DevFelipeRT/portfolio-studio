export interface TranslationItem {
    id: number;
    locale: string;
    label: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface ContactChannel {
    id: number;
    channel_type: string;
    label: string | null;
    value: string;
    href: string;
    locale: string;
    is_active: boolean;
    sort_order: number;
    translations?: TranslationItem[];
}

export interface ContactChannelTypeOption {
    value: string;
    label: string;
}
