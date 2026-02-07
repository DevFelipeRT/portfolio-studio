import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    PageForm,
    type PageFormData,
} from '@/Modules/ContentManagement/features/content-pages/admin/form/PageForm';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

export default function PageCreate() {
    const { data, setData, post, processing, errors } = useForm<PageFormData>({
        slug: '',
        internal_name: '',
        title: '',
        meta_title: '',
        meta_description: '',
        layout_key: '',
        locale: '',
        is_published: false,
        is_indexable: true,
    });

    const handleChange = (field: keyof PageFormData, value: unknown): void => {
        setData(field, value as never);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        post(route('admin.content.pages.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Create content page
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Define a new content-managed page before composing its
                        sections.
                    </p>
                </div>
            }
        >
            <Head title="Create page" />

            <div className="mx-auto max-w-4xl space-y-6">
                <PageForm
                    mode="create"
                    data={data}
                    errors={errors}
                    processing={processing}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                />
            </div>
        </AuthenticatedLayout>
    );
}
