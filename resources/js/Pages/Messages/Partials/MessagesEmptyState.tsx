// resources/js/Pages/Messages/Partials/MessagesEmptyState.tsx

/**
 * MessagesEmptyState renders a friendly message when there are no messages.
 */
export function MessagesEmptyState() {
    return (
        <p className="text-muted-foreground text-sm">
            No messages have been received yet.
        </p>
    );
}
