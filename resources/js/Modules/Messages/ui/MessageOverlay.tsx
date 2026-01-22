// resources/js/Pages/Messages/Partials/MessageOverlay.tsx

import { Badge } from '@/Components/Ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/Components/Ui/dialog';
import { Separator } from '@/Components/Ui/separator';
import type { Message } from '@/Modules/Messages/core/types';

interface MessageOverlayProps {
    open: boolean;
    message: Message | null;
    onOpenChange: (open: boolean) => void;
}

/**
 * MessageOverlay displays a single message in a modal overlay.
 */
export function MessageOverlay({
    open,
    message,
    onOpenChange,
}: MessageOverlayProps) {
    if (!message) {
        return null;
    }

    const createdAt = new Date(message.created_at);

    const createdAtDate = createdAt.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });

    const createdAtTime = createdAt.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex flex-wrap items-center gap-2 text-base">
                        <span className="font-semibold">Contact message</span>

                        <Badge variant="outline" className="text-xs lowercase">
                            {message.email}
                        </Badge>
                    </DialogTitle>

                    <DialogDescription className="text-muted-foreground mt-2 space-y-1 text-xs">
                        <p>
                            From{' '}
                            <span className="text-foreground font-medium">
                                {message.name}
                            </span>
                        </p>

                        <p>
                            Received on {createdAtDate} at {createdAtTime}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-1">
                            <Badge
                                variant={message.seen ? 'default' : 'outline'}
                            >
                                {message.seen ? 'Seen' : 'Unseen'}
                            </Badge>

                            <Badge
                                variant={
                                    message.important ? 'default' : 'outline'
                                }
                            >
                                {message.important ? 'Important' : 'Regular'}
                            </Badge>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <Separator className="my-4" />

                <div className="max-h-80 overflow-y-auto text-sm leading-relaxed">
                    <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                        Message
                    </p>

                    <p className="text-foreground whitespace-pre-line">
                        {message.message}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
