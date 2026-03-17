// resources/js/Pages/Messages/Partials/MessagesEmptyState.tsx

import {
    MESSAGES_NAMESPACES,
    useMessagesTranslation,
} from '@/modules/messages/i18n';

/**
 * MessagesEmptyState renders a friendly message when there are no messages.
 */
export function MessagesEmptyState() {
    const { translate: tMessages } = useMessagesTranslation(
        MESSAGES_NAMESPACES.messages,
    );

    return (
        <p className="text-muted-foreground text-sm">
            {tMessages('emptyState.description')}
        </p>
    );
}
