// resources/js/Pages/Messages/Partials/MessagesHeader.tsx

import { Badge } from '@/components/ui/badge';

interface MessagesHeaderProps {
    total: number;
}

/**
 * MessagesHeader renders the in-page header area for the inbox.
 */
export function MessagesHeader({ total }: MessagesHeaderProps) {
  return (
    <div className="mb-6 space-y-6">
      <div>
        <h1 className="text-xl leading-tight font-semibold">
          Contact messages
        </h1>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-muted-foreground mt-1 text-sm">
            Messages received from the portfolio landing form.
          </p>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Badge variant="outline">Total: {total}</Badge>
        </div>
      </div>
    </div>
  );
}
