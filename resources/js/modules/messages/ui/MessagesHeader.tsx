// resources/js/Pages/Messages/Partials/MessagesHeader.tsx

import { Badge } from '@/components/ui/badge';
import {
  MESSAGES_NAMESPACES,
  useMessagesTranslation,
} from '@/modules/messages/i18n';

interface MessagesHeaderProps {
  resultsTotal: number;
  unreadCount: number;
  importantCount: number;
}

/**
 * MessagesHeader renders the in-page header area for the inbox.
 */
export function MessagesHeader({
  resultsTotal,
  unreadCount,
  importantCount,
}: MessagesHeaderProps) {
  const { translate: tMessages } = useMessagesTranslation(
    MESSAGES_NAMESPACES.messages,
  );

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl leading-tight font-semibold">
          {tMessages('page.headerTitle')}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {tMessages('page.headerDescription')}
        </p>
      </div>

      <div className="text-muted-foreground flex items-center gap-2 text-xs sm:pt-1">
        <Badge variant="outline">
          {tMessages('page.results', { count: resultsTotal })}
        </Badge>
        <Badge variant="outline">
          {tMessages('page.unread', { count: unreadCount })}
        </Badge>
        <Badge variant="outline">
          {tMessages('page.important', { count: importantCount })}
        </Badge>
      </div>
    </div>
  );
}
