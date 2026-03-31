// resources/js/Pages/Messages/Partials/MessagesRow.tsx

import type { Message } from '@/modules/messages/core/types';

import {
  InteractiveTableRow,
  TableActionCell,
  TableActionsMenu,
  TableActionsMenuItem,
  TableBooleanBadge,
  TableDateText,
  TableMetaCell,
  TableTitleCell,
  tablePresets,
} from '@/common/table';
import { cn } from '@/lib/utils';
import {
  MESSAGES_NAMESPACES,
  useMessagesTranslation,
} from '@/modules/messages/i18n';
import {
  CheckCircle2,
  CircleDot,
  Eye,
  Minus,
  RotateCcw,
  Star,
  Trash2,
} from 'lucide-react';
import React from 'react';

interface MessagesRowProps {
    message: Message;
    onRowClick(message: Message): void;
    onToggleImportant(message: Message, event?: React.MouseEvent): void;
    onToggleSeen(message: Message, event?: React.MouseEvent): void;
    onDelete(message: Message, event?: React.MouseEvent): void;
}

/**
 * MessagesRow renders a single message row with status and actions.
 */
export function MessagesRow({
  message,
  onRowClick,
  onToggleImportant,
  onToggleSeen,
  onDelete,
}: MessagesRowProps) {
  const { locale, translate: tMessages } = useMessagesTranslation(
    MESSAGES_NAMESPACES.messages,
  );
  const { translate: tActions } = useMessagesTranslation(
    MESSAGES_NAMESPACES.actions,
  );

  return (
    <InteractiveTableRow
      active={!message.seen}
      interactive
      variant={message.seen ? 'default' : 'emphasized'}
      onActivate={() => onRowClick(message)}
    >
      <TableTitleCell
        className={cn(
          tablePresets.summaryCell,
          'content-center pr-2 sm:w-52',
        )}
        title={message.name}
        subtitle={message.email}
      />

      <TableMetaCell className="hidden sm:table-cell">
        <span className="text-muted-foreground block truncate text-sm">
          {truncate(message.message, 80)}
        </span>
      </TableMetaCell>

      <TableMetaCell
        className={cn(
          tablePresets.statusCell,
          'content-center pr-2 sm:w-32',
        )}
      >
        <TableBooleanBadge
          active={!message.seen}
          activeLabel={tMessages('status.new')}
          inactiveLabel={tMessages('status.seen')}
          activeIcon={CircleDot}
          inactiveIcon={CheckCircle2}
        />
      </TableMetaCell>

      <TableMetaCell
        className={cn(
          tablePresets.statusCell,
          'content-center pr-2 sm:w-32',
        )}
      >
        <TableBooleanBadge
          active={message.important}
          activeLabel={tMessages('status.important')}
          inactiveLabel={tMessages('status.regular')}
          activeIcon={Star}
          inactiveIcon={Minus}
        />
      </TableMetaCell>

      <TableMetaCell
        className={cn(
          tablePresets.metaCell,
          'content-center pr-2 text-right sm:w-28',
        )}
      >
        <TableDateText
          value={message.created_at}
          locale={locale}
          todayAsTime
        />
      </TableMetaCell>

      <TableActionCell
        className={cn(tablePresets.actionCell, 'content-center sm:w-12')}
      >
        <TableActionsMenu triggerLabel={tActions('openMenu')}>
          <TableActionsMenuItem onClick={() => onRowClick(message)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>{tActions('viewMessage')}</span>
          </TableActionsMenuItem>

          <TableActionsMenuItem
            onClick={(event) =>
              onToggleImportant(message, event)
            }
          >
            <Star className="mr-2 h-4 w-4" />
            <span>
              {message.important
                ? tActions('removeImportant')
                : tActions('markAsImportant')}
            </span>
          </TableActionsMenuItem>

          <TableActionsMenuItem
            onClick={(event) =>
              onToggleSeen(message, event)
            }
          >
            {message.seen ? (
              <RotateCcw className="mr-2 h-4 w-4" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            <span>
              {message.seen
                ? tActions('markAsNew')
                : tActions('markAsSeen')}
            </span>
          </TableActionsMenuItem>

          <TableActionsMenuItem
            onClick={(event) => onDelete(message, event)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>{tActions('delete')}</span>
          </TableActionsMenuItem>
        </TableActionsMenu>
      </TableActionCell>
    </InteractiveTableRow>
  );
}

function truncate(text: string, maxLength: number): string {
    const trimmed = text.trim();

    if (trimmed.length <= maxLength) {
        return trimmed;
    }

    return `${trimmed.slice(0, maxLength - 1)}…`;
}
