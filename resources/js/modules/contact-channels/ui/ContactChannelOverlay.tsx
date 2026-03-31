import { TableBooleanBadge, TableDetailDialog } from '@/common/table';
import type { ContactChannel } from '@/modules/contact-channels/core/types';
import {
  CONTACT_CHANNELS_NAMESPACES,
  useContactChannelsTranslation,
} from '@/modules/contact-channels/i18n';
import { Power, PowerOff } from 'lucide-react';

interface ContactChannelOverlayProps {
  open: boolean;
  channel: ContactChannel | null;
  onOpenChange: (open: boolean) => void;
}

export function ContactChannelOverlay({
  open,
  channel,
  onOpenChange,
}: ContactChannelOverlayProps) {
  const { translate: tForm } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.form,
  );
  const { translate: tContactChannels } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.contactChannels,
  );

  if (!channel) {
    return null;
  }

  const typeLabel = tContactChannels(
    `socials.${channel.channel_type}.label`,
    channel.channel_type,
  );

  return (
    <TableDetailDialog
      open={open}
      onOpenChange={onOpenChange}
      title={typeLabel}
      className="max-w-xl"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <TableBooleanBadge
            active={channel.is_active}
            activeLabel={tForm('values.active')}
            inactiveLabel={tForm('values.inactive')}
            activeIcon={Power}
            inactiveIcon={PowerOff}
          />
          <span className="bg-muted text-muted-foreground inline-flex rounded px-2 py-0.5 font-mono text-xs">
            {channel.locale}
          </span>
        </div>

        <InfoRow
          label={tForm('fields.label.label')}
          value={channel.label ?? tForm('fields.label.placeholder')}
        />
        <InfoRow label={tForm('fields.value.label')} value={channel.value} />
        <InfoRow
          label="URL"
          value={
            <a
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              className="text-primary break-all underline underline-offset-4"
            >
              {channel.href}
            </a>
          }
        />
        <InfoRow label={tForm('fields.sort_order.label')} value={String(channel.sort_order)} />
      </div>
    </TableDetailDialog>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <div className="text-sm">{value}</div>
    </div>
  );
}
