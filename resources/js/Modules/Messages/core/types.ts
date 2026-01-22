export interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    important: boolean;
    seen: boolean;
    created_at: string;
}
