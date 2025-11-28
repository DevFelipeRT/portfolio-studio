// resources/js/Pages/Technologies/Create.tsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { TechForm } from './Partials/TechForm';

type PagePropsWithTechnologyCategories = PageProps<{
    technologyCategories: Record<string, string>;
}>;

export default function Create() {
    const { technologyCategories } =
        usePage<PagePropsWithTechnologyCategories>().props;

    const { data, setData, post, processing, errors } =
        useForm<TechnologyFormData>({
            name: '',
            category: '',
        });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        post(route('technologies.store'));
    };

    const handleChange = (
        field: keyof TechnologyFormData,
        value: string,
    ): void => {
        setData(field, value);
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    New technology
                </h1>
            }
        >
            <Head title="New technology" />

            <div className="overflow-hidden">
                <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('technologies.index')}
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Back to technologies
                        </Link>
                    </div>

                    <TechForm
                        data={data}
                        errors={errors}
                        categories={technologyCategories}
                        processing={processing}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        cancelHref={route('technologies.index')}
                        submitLabel="Save"
                        alignActions="right"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
