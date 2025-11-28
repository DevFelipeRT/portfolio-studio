// resources/js/Pages/Technologies/Edit.tsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { Technology } from '../types';
import { TechForm } from './Partials/TechForm';

interface EditTechnologyProps {
    technology: Technology;
}

type PagePropsWithTechnologyCategories = PageProps<{
    technologyCategories: Record<string, string>;
}>;

export default function Edit({ technology }: EditTechnologyProps) {
    const { technologyCategories } =
        usePage<PagePropsWithTechnologyCategories>().props;

    const { data, setData, put, processing, errors } =
        useForm<TechnologyFormData>({
            name: technology.name,
            category: technology.category ?? '',
        });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        put(route('technologies.update', technology.id));
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
                    Edit technology
                </h1>
            }
        >
            <Head title={`Edit technology: ${technology.name}`} />

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
                        submitLabel="Save changes"
                        deleteHref={route(
                            'technologies.destroy',
                            technology.id,
                        )}
                        deleteLabel="Delete"
                        alignActions="split"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
