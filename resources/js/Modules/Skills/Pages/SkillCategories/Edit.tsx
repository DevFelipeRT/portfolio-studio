import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { SkillCategory } from '@/Modules/Skills/core/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import type { SkillCategoryFormData } from '@/Modules/Skills/core/forms';
import { SkillCategoryForm } from '@/Modules/Skills/ui/SkillCategoryForm';

interface EditSkillCategoryProps {
    category: SkillCategory;
}

export default function Edit({ category }: EditSkillCategoryProps) {
    const { data, setData, put, processing, errors } =
        useForm<SkillCategoryFormData>({
            name: category.name,
            slug: category.slug ?? '',
        });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        put(route('skill-categories.update', category.id));
    };

    const handleChange = (
        field: keyof SkillCategoryFormData,
        value: string,
    ): void => {
        setData(field, value);
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    Edit skill category
                </h1>
            }
        >
            <Head title={`Edit skill category: ${category.name}`} />

            <div className="overflow-hidden">
                <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('skill-categories.index')}
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Back to categories
                        </Link>
                    </div>

                    <SkillCategoryForm
                        data={data}
                        errors={errors}
                        processing={processing}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        cancelHref={route('skill-categories.index')}
                        submitLabel="Save changes"
                        deleteHref={route(
                            'skill-categories.destroy',
                            category.id,
                        )}
                        deleteLabel="Delete"
                        alignActions="split"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
