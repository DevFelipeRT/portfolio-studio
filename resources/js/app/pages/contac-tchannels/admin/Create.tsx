import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import type { ContactChannelFormData } from '@/Modules/ContactChannels/core/forms';
import type { ContactChannelTypeOption } from '@/Modules/ContactChannels/core/types';
import { ContactChannelForm } from '@/Modules/ContactChannels/ui/ContactChannelForm';

interface CreateContactChannelProps {
    channelTypes: ContactChannelTypeOption[];
}

export default function Create({ channelTypes }: CreateContactChannelProps) {
    const { data, setData, post, processing, errors } =
        useForm<ContactChannelFormData>({
            locale: '',
            channel_type: channelTypes[0]?.value ?? '',
            label: '',
            value: '',
            is_active: true,
            sort_order: 0,
        });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        post(route('contact-channels.store'));
    };

    const handleChange = (
        field: keyof ContactChannelFormData,
        value: string | number | boolean | '',
    ): void => {
        setData(field, value as never);
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    New contact channel
                </h1>
            }
        >
            <Head title="New contact channel" />

            <div className="overflow-hidden">
                <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('contact-channels.index')}
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Back to contact channels
                        </Link>
                    </div>

                    <ContactChannelForm
                        data={data}
                        errors={errors}
                        channelTypes={channelTypes}
                        processing={processing}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        cancelHref={route('contact-channels.index')}
                        submitLabel="Save"
                        alignActions="right"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
