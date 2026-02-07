import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import type { ContactChannel } from '@/Modules/ContactChannels/core/types';

interface ContactChannelsIndexProps {
    channels: ContactChannel[];
}

const typeLabels: Record<string, string> = {
    email: 'Email',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    custom: 'Custom',
};

export default function Index({ channels }: ContactChannelsIndexProps) {
    const hasChannels = channels.length > 0;

    const labelFor = (channel: ContactChannel): string => {
        if (channel.channel_type === 'custom' && channel.label) {
            return channel.label;
        }

        return typeLabels[channel.channel_type] ?? channel.channel_type;
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    Contact channels
                </h1>
            }
        >
            <Head title="Contact channels" />

            <div className="overflow-hidden">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage the contact channels displayed on your
                            website.
                        </p>
                    </div>

                    <Link
                        href={route('contact-channels.create')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                        New channel
                    </Link>
                </div>

                {!hasChannels && (
                    <p className="text-muted-foreground text-sm">
                        No contact channels configured yet.
                    </p>
                )}

                {hasChannels && (
                    <div className="bg-card overflow-hidden rounded-lg border">
                        <table className="min-w-full divide-y text-sm">
                            <thead className="bg-muted/60">
                                <tr>
                                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                                        Type
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                                        Label
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                                        Value
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                                        Active
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                                        Order
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-right font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {channels.map((channel) => (
                                    <tr key={channel.id}>
                                        <td className="px-4 py-3 align-top">
                                            {typeLabels[channel.channel_type] ??
                                                channel.channel_type}
                                        </td>
                                        <td className="px-4 py-3 align-top">
                                            {labelFor(channel)}
                                        </td>
                                        <td className="px-4 py-3 align-top text-xs text-muted-foreground">
                                            {channel.value}
                                        </td>
                                        <td className="px-4 py-3 align-top text-xs">
                                            {channel.is_active ? 'Yes' : 'No'}
                                        </td>
                                        <td className="px-4 py-3 align-top text-xs">
                                            {channel.sort_order}
                                        </td>
                                        <td className="px-4 py-3 align-top">
                                            <div className="flex justify-end gap-3 text-xs">
                                                <Link
                                                    href={route(
                                                        'contact-channels.edit',
                                                        channel.id,
                                                    )}
                                                    className="text-primary font-medium hover:underline"
                                                >
                                                    Edit
                                                </Link>

                                                <Link
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
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </Link>

                                                <Link
                                                    href={route(
                                                        'contact-channels.destroy',
                                                        channel.id,
                                                    )}
                                                    method="delete"
                                                    as="button"
                                                    className="text-destructive font-medium hover:underline"
                                                >
                                                    Delete
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
