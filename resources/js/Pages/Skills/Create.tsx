// resources/js/Pages/Skills/Create.tsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { SkillCategory } from '@/Pages/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { SkillForm } from './Partials/SkillForm';

interface CreateSkillProps {
    categories: SkillCategory[];
}

export default function Create({ categories }: CreateSkillProps) {
    const { data, setData, post, processing, errors } =
        useForm<SkillFormData>({
            name: '',
            skill_category_id: '',
        });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        post(route('skills.store'));
    };

    const handleChange = (
        field: keyof SkillFormData,
        value: number | '',
    ): void => {
        setData(field, value);
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    New skill
                </h1>
            }
        >
            <Head title="New skill" />

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

                    <SkillForm
                        data={data}
                        errors={errors}
                        categories={categories}
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
