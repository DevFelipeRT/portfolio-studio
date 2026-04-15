import type { ContactChannel } from '@/modules/contact-channels/core/types';
import { BooleanBadge } from '@/components/badges';
import {
  CONTACT_CHANNELS_NAMESPACES,
  useContactChannelsTranslation,
} from '@/modules/contact-channels/i18n';

import {
  InteractiveTableRow,
  TableActionCell,
  TableActionsMenu,
  TableActionsMenuItem,
  TableMetaCell,
  TableTitleCell,
} from '@/common/table';
import { PageLink } from '@/common/page-runtime';
import { Eye, Pencil, Power, PowerOff, Trash2 } from 'lucide-react';

interface ContactChannelsRowProps {
  channel: ContactChannel;
  onRowClick(channel: ContactChannel): void;
}

export function ContactChannelsRow({ channel, onRowClick }: ContactChannelsRowProps) {
  const { translate: tActions } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.actions,
  );
  const { translate: tForm } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.form,
  );
  const { translate: tContactChannels } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.contactChannels,
  );

  const typeLabel = tContactChannels(
    `socials.${channel.channel_type}.label`,
    channel.channel_type,
  );

  const label = channel.label?.trim() ?? '';

  return (
    <InteractiveTableRow
      interactive
      variant="default"
      onActivate={() => onRowClick(channel)}
    >
      <TableTitleCell className="sm:w-40" title={typeLabel} />

      <TableMetaCell className="sm:w-40">
        <span className="block truncate text-xs">
          {label !== '' ? label : tForm('fields.label.placeholder')}
        </span>
      </TableMetaCell>

      <TableMetaCell className="min-w-0">
        <span className="block truncate text-xs">{channel.value}</span>
      </TableMetaCell>

      <TableMetaCell className="sm:w-28">
        <BooleanBadge
          active={channel.is_active}
          activeLabel={tForm('values.active')}
          inactiveLabel={tForm('values.inactive')}
          activeIcon={Power}
          inactiveIcon={PowerOff}
        />
      </TableMetaCell>

      <TableMetaCell className="sm:w-16">
        <span className="block whitespace-nowrap">{channel.sort_order}</span>
      </TableMetaCell>

      <TableActionCell className="content-center">
        <TableActionsMenu triggerLabel={tActions('openMenu')}>
          <TableActionsMenuItem onClick={() => onRowClick(channel)}>
            <Eye className="mr-2 h-4 w-4" />
            <span>{tActions('viewDetails', 'View details')}</span>
          </TableActionsMenuItem>

          <TableActionsMenuItem asChild>
            <PageLink href={route('contact-channels.edit', channel.id)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>{tActions('edit')}</span>
            </PageLink>
          </TableActionsMenuItem>

          <TableActionsMenuItem asChild>
            <PageLink
              href={route('contact-channels.toggle-active', channel.id)}
              method="post"
              as="button"
              data={{
                is_active: !channel.is_active,
              }}
            >
              <Power className="mr-2 h-4 w-4" />
              <span>
                {channel.is_active
                  ? tActions('deactivate')
                  : tActions('activate')}
              </span>
            </PageLink>
          </TableActionsMenuItem>

          <TableActionsMenuItem asChild>
            <PageLink
              href={route('contact-channels.destroy', channel.id)}
              method="delete"
              as="button"
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>{tActions('delete')}</span>
            </PageLink>
          </TableActionsMenuItem>
        </TableActionsMenu>
      </TableActionCell>
    </InteractiveTableRow>
  );
}
