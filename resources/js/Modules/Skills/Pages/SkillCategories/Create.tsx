import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import type { SkillCategoryFormData } from '@/Modules/Skills/core/forms';
import { SkillCategoryForm } from '@/Modules/Skills/ui/SkillCategoryForm';

export default function Create() {
    const { data, setData, post, processing, errors } =
        useForm<SkillCategoryFormData>({
            name: '',
            slug: '',
            locale: '',
        });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        post(route('skill-categories.store'));
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
                    New skill category
                </h1>
            }
        >
            <Head title="New skill category" />

            <div className="overflow-hidden">
                <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('skills.index')}
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Back to skills
                        </Link>
                    </div>

                    <SkillCategoryForm
                        data={data}
                        errors={errors}
                        processing={processing}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        cancelHref={route('skills.index')}
                        submitLabel="Save"
                        alignActions="right"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
