// resources/js/Pages/Skills/Edit.tsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { Skill, SkillCategory } from '@/Modules/Skills/core/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import type { SkillFormData } from '@/Modules/Skills/core/forms';
import { SkillForm } from '@/Modules/Skills/ui/SkillForm';

interface EditSkillProps {
    skill: Skill;
    categories: SkillCategory[];
}

export default function Edit({ skill, categories }: EditSkillProps) {
    const { data, setData, put, processing, errors } =
        useForm<SkillFormData>({
            name: skill.name,
            skill_category_id: skill.skill_category_id ?? '',
        });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        put(route('skills.update', skill.id));
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
                    Edit skill
                </h1>
            }
        >
            <Head title={`Edit skill: ${skill.name}`} />

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
                        submitLabel="Save changes"
                        deleteHref={route(
                            'skills.destroy',
                            skill.id,
                        )}
                        deleteLabel="Delete"
                        alignActions="split"
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
