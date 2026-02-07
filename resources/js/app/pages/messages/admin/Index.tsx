// resources/js/Pages/Messages/Index.tsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import type { Message } from '@/Modules/Messages/core/types';
import { MessageOverlay } from '@/Modules/Messages/ui/MessageOverlay';
import { MessagesEmptyState } from '@/Modules/Messages/ui/MessagesEmptyState';
import { MessagesHeader } from '@/Modules/Messages/ui/MessagesHeader';
import { MessagesTable } from '@/Modules/Messages/ui/MessagesTable';

interface MessagesIndexProps {
    messages: Message[];
}

/**
 * Messages index page for listing and managing contact messages.
 */
export default function Index({ messages }: MessagesIndexProps) {
    const [items, setItems] = useState<Message[]>(() => [...messages]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(
        null,
    );
    const [overlayOpen, setOverlayOpen] = useState(false);

    const hasMessages = items.length > 0;

    const orderedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            if (a.important !== b.important) {
                return a.important ? -1 : 1;
            }

            const aDate = new Date(a.created_at).getTime();
            const bDate = new Date(b.created_at).getTime();

            return bDate - aDate;
        });
    }, [items]);

    function markLocallyAsSeen(id: number): void {
        setItems((current) =>
            current.map((item) =>
                item.id === id ? { ...item, seen: true } : item,
            ),
        );
    }

    function handleRowClick(message: Message): void {
        if (!message.seen) {
            markLocallyAsSeen(message.id);

            router.patch(
                route('messages.mark-as-seen', message.id),
                {},
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }

        setSelectedMessage({ ...message, seen: true });
        setOverlayOpen(true);
    }

    function handleOverlayChange(open: boolean): void {
        if (!open) {
            setOverlayOpen(false);
            setSelectedMessage(null);
            return;
        }

        setOverlayOpen(true);
    }

    function handleToggleImportant(
        message: Message,
        event?: React.MouseEvent,
    ): void {
        event?.stopPropagation();

        const nextImportant = !message.important;

        setItems((current) =>
            current.map((item) =>
                item.id === message.id
                    ? { ...item, important: nextImportant }
                    : item,
            ),
        );

        router.patch(
            route(
                nextImportant
                    ? 'messages.mark-as-important'
                    : 'messages.mark-as-not-important',
                message.id,
            ),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    function handleToggleSeen(
        message: Message,
        event?: React.MouseEvent,
    ): void {
        event?.stopPropagation();

        const nextSeen = !message.seen;

        setItems((current) =>
            current.map((item) =>
                item.id === message.id ? { ...item, seen: nextSeen } : item,
            ),
        );

        router.patch(
            route(
                nextSeen ? 'messages.mark-as-seen' : 'messages.mark-as-unseen',
                message.id,
            ),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    function handleDelete(message: Message, event?: React.MouseEvent): void {
        event?.stopPropagation();

        if (!window.confirm('Are you sure you want to delete this message?')) {
            return;
        }

        router.delete(route('messages.destroy', message.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setItems((current) =>
                    current.filter((item) => item.id !== message.id),
                );
            },
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    Contact messages
                </h1>
            }
        >
            <Head title="Messages" />

            <div className="overflow-hidden">
                <MessagesHeader total={items.length} />

                {!hasMessages && <MessagesEmptyState />}

                {hasMessages && (
                    <MessagesTable
                        items={orderedItems}
                        onRowClick={handleRowClick}
                        onToggleImportant={handleToggleImportant}
                        onToggleSeen={handleToggleSeen}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            <MessageOverlay
                open={overlayOpen}
                message={selectedMessage}
                onOpenChange={handleOverlayChange}
            />
        </AuthenticatedLayout>
    );
}
