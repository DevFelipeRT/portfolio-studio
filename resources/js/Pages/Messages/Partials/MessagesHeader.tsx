// resources/js/Pages/Messages/Partials/MessagesHeader.tsx

import { Badge } from '@/Components/Ui/badge';

interface MessagesHeaderProps {
    total: number;
}

/**
 * MessagesHeader renders the page header and summary for the inbox.
 */
export function MessagesHeader({ total }: MessagesHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-muted-foreground mt-1 text-sm">
                    Messages received from the portfolio landing form.
                </p>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Badge variant="outline">Total: {total}</Badge>
            </div>
        </div>
    );
}
