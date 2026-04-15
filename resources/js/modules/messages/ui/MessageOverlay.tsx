// resources/js/Pages/Messages/Partials/MessageOverlay.tsx

import { Badge } from '@/components/ui/badge';
import { ItemDialog } from '@/common/table';
import { normalizeIntlLocale } from '@/common/i18n/normalizeIntlLocale';
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
        <ItemDialog open={open} onOpenChange={onOpenChange}>
            <ItemDialog.Content className="max-w-xl">
                <ItemDialog.Header>
                    <ItemDialog.Main>
                        <ItemDialog.Heading>
                            <ItemDialog.Title>
                                {tMessages('overlay.title')}
                            </ItemDialog.Title>
                        </ItemDialog.Heading>

                        <ItemDialog.Metadata>
                            <span>
                                {tMessages('overlay.from', { name: message.name })}
                            </span>
                            <span>
                                {tMessages('overlay.receivedOn', {
                                    date: createdAtDate,
                                    time: createdAtTime,
                                })}
                            </span>
                        </ItemDialog.Metadata>

                        <ItemDialog.Badges>
                            <Badge variant="outline" className="text-xs lowercase">
                                {message.email}
                            </Badge>
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
                        </ItemDialog.Badges>
                    </ItemDialog.Main>
                </ItemDialog.Header>

                <ItemDialog.Body>
                    <div className="max-h-80 overflow-y-auto text-sm leading-relaxed">
                        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                            {tMessages('overlay.messageLabel')}
                        </p>

                        <p className="text-foreground whitespace-pre-line">
                            {message.message}
                        </p>
                    </div>
                </ItemDialog.Body>
            </ItemDialog.Content>
        </ItemDialog>
    );
}
