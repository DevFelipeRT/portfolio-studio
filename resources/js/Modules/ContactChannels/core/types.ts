export interface ContactChannel {
    id: number;
    channel_type: string;
    label: string | null;
    value: string;
    href: string;
    is_active: boolean;
    sort_order: number;
}

export interface ContactChannelTypeOption {
    value: string;
    label: string;
}
