export type ContactChannelFormData = {
    locale: string;
    confirm_swap?: boolean;
    channel_type: string;
    label: string;
    value: string;
    is_active: boolean;
    sort_order: number | '';
};
