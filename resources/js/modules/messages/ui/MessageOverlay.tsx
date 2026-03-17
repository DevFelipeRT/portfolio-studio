// resources/js/Pages/Messages/Partials/MessageOverlay.tsx

import { Badge } from '@/components/ui/badge';
import { normalizeIntlLocale } from '@/common/i18n/normalizeIntlLocale';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
    MESSAGES_NAMESPACES,
    useMessagesTranslation,
} from '@/modules/messages/i18n';
import type { Message } from '@/modules/messages/core/types';

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
    const { locale, translate: tMessages } = useMessagesTranslation(
        MESSAGES_NAMESPACES.messages,
    );
    const normalizedLocale = normalizeIntlLocale(locale);
    if (!message) {
        return null;
    }

    const createdAt = new Date(message.created_at);

    const createdAtDate = createdAt.toLocaleDateString(normalizedLocale, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });

    const createdAtTime = createdAt.toLocaleTimeString(normalizedLocale, {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex flex-wrap items-center gap-2 text-base">
                        <span className="font-semibold">
                            {tMessages('overlay.title')}
                        </span>

                        <Badge variant="outline" className="text-xs lowercase">
                            {message.email}
                        </Badge>
                    </DialogTitle>

                    <DialogDescription className="text-muted-foreground mt-2 space-y-1 text-xs">
                        <p>
                            {tMessages('overlay.from', { name: message.name })}
                        </p>

                        <p>
                            {tMessages('overlay.receivedOn', {
                                date: createdAtDate,
                                time: createdAtTime,
                            })}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-1">
                            <Badge
                                variant={message.seen ? 'default' : 'outline'}
                            >
                                {message.seen
                                    ? tMessages('status.seen')
                                    : tMessages('status.unseen')}
                            </Badge>

                            <Badge
                                variant={
                                    message.important ? 'default' : 'outline'
                                }
                            >
                                {message.important
                                    ? tMessages('status.important')
                                    : tMessages('status.regular')}
                            </Badge>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <Separator className="my-4" />

                <div className="max-h-80 overflow-y-auto text-sm leading-relaxed">
                    <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                        {tMessages('overlay.messageLabel')}
                    </p>

                    <p className="text-foreground whitespace-pre-line">
                        {message.message}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
