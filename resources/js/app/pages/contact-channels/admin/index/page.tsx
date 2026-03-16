import AuthenticatedLayout from '@/app/layouts/AuthenticatedLayout';
import { PageContent } from '@/app/layouts/primitives';
import { PageHead, PageLink } from '@/common/page-runtime';
import type { ContactChannel } from '@/modules/contact-channels/core/types';
import { useContactChannelsTranslation } from '@/modules/contact-channels/i18n';
import { CONTACT_CHANNELS_NAMESPACES } from '@/modules/contact-channels/i18n';

interface ContactChannelsIndexProps {
  channels: ContactChannel[];
}

export default function Index({ channels }: ContactChannelsIndexProps) {
  return <ContactChannelsIndexI18nContent channels={channels} />;
}

function ContactChannelsIndexI18nContent({ channels }: ContactChannelsIndexProps) {
  const hasChannels = channels.length > 0;
  const { translate: tActions } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.actions,
  );
  const { translate: tForm } = useContactChannelsTranslation(
    CONTACT_CHANNELS_NAMESPACES.form,
  );
  const { translate: tContactChannels } =
    useContactChannelsTranslation(CONTACT_CHANNELS_NAMESPACES.contactChannels);

  const typeLabel = (channelType: string): string => {
    return tContactChannels(`socials.${channelType}.label`, channelType);
  };

  const labelFor = (channel: ContactChannel): string => {
    if (channel.channel_type === 'custom' && channel.label) {
      return channel.label;
    }

    return typeLabel(channel.channel_type);
  };

  return (
    <AuthenticatedLayout>
      <PageHead title={tForm('sections.managementTitle')} />

      <PageContent className="overflow-hidden py-8" pageWidth="container">
        <div className="mb-6 space-y-6">
          <div>
            <h1 className="text-xl leading-tight font-semibold">
              {tForm('sections.managementTitle')}
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-muted-foreground mt-1 text-sm">
                {tForm('help.managementSubtitle')}
              </p>
            </div>

            <PageLink
              href={route('contact-channels.create')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {tActions('newChannel')}
            </PageLink>
          </div>
        </div>

        {!hasChannels && (
          <p className="text-muted-foreground text-sm">
            {tForm('emptyState.index')}
          </p>
        )}

        {hasChannels && (
          <div className="bg-card overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    {tForm('columns.type')}
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    {tForm('columns.label')}
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    {tForm('columns.value')}
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    {tForm('columns.active')}
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                    {tForm('columns.order')}
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right font-medium">
                    {tForm('columns.actions')}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {channels.map((channel) => (
                  <tr key={channel.id}>
                    <td className="px-4 py-3 align-top">
                      {typeLabel(channel.channel_type)}
                    </td>
                    <td className="px-4 py-3 align-top">{labelFor(channel)}</td>
                    <td className="text-muted-foreground px-4 py-3 align-top text-xs">
                      {channel.value}
                    </td>
                    <td className="px-4 py-3 align-top text-xs">
                      {channel.is_active ? tActions('yes') : tActions('no')}
                    </td>
                    <td className="px-4 py-3 align-top text-xs">
                      {channel.sort_order}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex justify-end gap-3 text-xs">
                        <PageLink
                          href={route('contact-channels.edit', channel.id)}
                          className="text-primary font-medium hover:underline"
                        >
                          {tActions('edit')}
                        </PageLink>

                        <PageLink
                          href={route(
                            'contact-channels.toggle-active',
                            channel.id,
                          )}
                          method="post"
                          as="button"
                          data={{
                            is_active: !channel.is_active,
                          }}
                          className="text-muted-foreground font-medium hover:underline"
                        >
                          {channel.is_active
                            ? tActions('deactivate')
                            : tActions('activate')}
                        </PageLink>

                        <PageLink
                          href={route('contact-channels.destroy', channel.id)}
                          method="delete"
                          as="button"
                          className="text-destructive font-medium hover:underline"
                        >
                          {tActions('delete')}
                        </PageLink>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageContent>
    </AuthenticatedLayout>
  );
}

Index.i18n = ['contact-channels'];
