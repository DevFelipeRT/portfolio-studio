// resources/js/Pages/Messages/Partials/MessagesHeader.tsx

import { Badge } from '@/components/ui/badge';
import {
  MESSAGES_NAMESPACES,
  useMessagesTranslation,
} from '@/modules/messages/i18n';

interface MessagesHeaderProps {
    total: number;
}

/**
 * MessagesHeader renders the in-page header area for the inbox.
 */
export function MessagesHeader({ total }: MessagesHeaderProps) {
  const { translate: tMessages } = useMessagesTranslation(
    MESSAGES_NAMESPACES.messages,
  );

  return (
    <div className="mb-6 space-y-6">
      <div>
        <h1 className="text-xl leading-tight font-semibold">
          {tMessages('page.headerTitle')}
        </h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground mt-1 text-sm">
            {tMessages('page.headerDescription')}
          </p>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Badge variant="outline">
            {tMessages('page.total', { count: total })}
          </Badge>
        </div>
      </div>
    </div>
  );
}
