// resources/js/Pages/Messages/Index.tsx

import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead, pageRouter } from '@/common/page-runtime';
import { useMemo, useState } from 'react';

import type { Message } from '@/modules/messages/core/types';
import {
  MESSAGES_NAMESPACES,
  useMessagesTranslation,
} from '@/modules/messages/i18n';
import { MessageOverlay } from '@/modules/messages/ui/MessageOverlay';
import { MessagesEmptyState } from '@/modules/messages/ui/MessagesEmptyState';
import { MessagesHeader } from '@/modules/messages/ui/MessagesHeader';
import { MessagesTable } from '@/modules/messages/ui/MessagesTable';

interface MessagesIndexProps {
  messages: Message[];
}

/**
 * Messages index page for listing and managing contact messages.
 */
export default function Index({ messages }: MessagesIndexProps) {
  const { translate: tMessages } = useMessagesTranslation(
    MESSAGES_NAMESPACES.messages,
  );
  const [items, setItems] = useState<Message[]>(() => [...messages]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
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
      current.map((item) => (item.id === id ? { ...item, seen: true } : item)),
    );
  }

  function handleRowClick(message: Message): void {
    if (!message.seen) {
      markLocallyAsSeen(message.id);

      pageRouter.patch(
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
        item.id === message.id ? { ...item, important: nextImportant } : item,
      ),
    );

    pageRouter.patch(
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

  function handleToggleSeen(message: Message, event?: React.MouseEvent): void {
    event?.stopPropagation();

    const nextSeen = !message.seen;

    setItems((current) =>
      current.map((item) =>
        item.id === message.id ? { ...item, seen: nextSeen } : item,
      ),
    );

    pageRouter.patch(
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

    if (!window.confirm(tMessages('confirm.delete'))) {
      return;
    }

    pageRouter.delete(route('messages.destroy', message.id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setItems((current) => current.filter((item) => item.id !== message.id));
      },
    });
  }

  return (
    <AuthenticatedLayout>
      <PageHead title={tMessages('page.title')} />

      <PageContent className="overflow-hidden py-8" pageWidth="container">
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
      </PageContent>

      <MessageOverlay
        open={overlayOpen}
        message={selectedMessage}
        onOpenChange={handleOverlayChange}
      />
    </AuthenticatedLayout>
  );
}

Index.i18n = ['messages'];
