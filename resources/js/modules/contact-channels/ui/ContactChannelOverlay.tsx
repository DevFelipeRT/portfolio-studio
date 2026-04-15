import { ItemDialog } from '@/common/table';
import { BooleanBadge, InfoBadge } from '@/components/badges';
import type { ContactChannel } from '@/modules/contact-channels/core/types';
import {
  CONTACT_CHANNELS_NAMESPACES,
  useContactChannelsTranslation,
} from '@/modules/contact-channels/i18n';
import { Power, PowerOff } from 'lucide-react';
import { OverlayInfoRow } from './_partials';

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
    <ItemDialog open={open} onOpenChange={onOpenChange}>
        <ItemDialog.Content className="max-w-xl">
        <ItemDialog.Header>
          <ItemDialog.Main>
            <ItemDialog.Heading>
              <ItemDialog.Title>{typeLabel}</ItemDialog.Title>
            </ItemDialog.Heading>

            <ItemDialog.Badges>
              <BooleanBadge
                active={channel.is_active}
                activeLabel={tForm('values.active')}
                inactiveLabel={tForm('values.inactive')}
                activeIcon={Power}
                inactiveIcon={PowerOff}
              />
              <InfoBadge tone="muted" className="font-mono">
                {channel.locale}
              </InfoBadge>
            </ItemDialog.Badges>
          </ItemDialog.Main>
        </ItemDialog.Header>

        <ItemDialog.Body className="space-y-4">
          <OverlayInfoRow
            label={tForm('fields.label.label')}
            value={channel.label ?? tForm('fields.label.placeholder')}
          />
          <OverlayInfoRow
            label={tForm('fields.value.label')}
            value={channel.value}
          />
          <OverlayInfoRow
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
          <OverlayInfoRow
            label={tForm('fields.sort_order.label')}
            value={String(channel.sort_order)}
          />
        </ItemDialog.Body>
      </ItemDialog.Content>
    </ItemDialog>
  );
}
