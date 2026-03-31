export interface Message {
    id: number;
    name: string;
    email: string;
    message: string;
    important: boolean;
    seen: boolean;
    created_at: string;
}
