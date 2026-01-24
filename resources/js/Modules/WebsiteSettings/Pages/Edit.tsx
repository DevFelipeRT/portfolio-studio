import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';
import type { WebsiteSettingsPageProps } from '@/Modules/WebsiteSettings/core/types';
import {
    buildWebsiteSettingsFormData,
    syncLocaleMaps,
    type WebsiteSettingsFormData,
} from '@/Modules/WebsiteSettings/core/forms';
import {
    WebsiteSettingsForm,
} from '@/Modules/WebsiteSettings/ui/admin/WebsiteSettingsForm';

export default function Edit({ settings }: WebsiteSettingsPageProps) {
    const initialData = React.useMemo(
        () => buildWebsiteSettingsFormData(settings),
        [settings],
    );

    const { data, setData, put, processing, errors } =
        useForm<WebsiteSettingsFormData>(initialData);

    const handleChange = (field: keyof WebsiteSettingsFormData, value: unknown): void => {
        if (field === 'supported_locales') {
            const locales = Array.isArray(value) ? value : [];
            const next = syncLocaleMaps(
                {
                    ...(data as WebsiteSettingsFormData),
                    supported_locales: locales,
                },
                locales,
            );
            setData(next);
            return;
        }

        setData(field, value as never);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        put(route('website-settings.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    Website settings
                </h1>
            }
        >
            <Head title="Website settings" />

            <div className="overflow-hidden">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <WebsiteSettingsForm
                        data={data}
                        errors={errors}
                        processing={processing}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        cancelHref={route('dashboard')}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
