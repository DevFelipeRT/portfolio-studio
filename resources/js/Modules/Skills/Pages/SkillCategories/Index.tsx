import { Button } from '@/Components/Ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { SkillCategory } from '@/Modules/Skills/core/types';
import { Head, Link, router } from '@inertiajs/react';
import React from 'react';

interface SkillCategoriesIndexProps {
    categories: SkillCategory[];
}

export default function Index({ categories }: SkillCategoriesIndexProps) {
    const hasCategories = categories.length > 0;

    const handleEdit = (category: SkillCategory): void => {
        router.get(route('skill-categories.edit', category.id));
    };

    const handleDelete = (
        category: SkillCategory,
        event?: React.MouseEvent,
    ): void => {
        event?.stopPropagation();

        if (
            !window.confirm(
                'Are you sure you want to delete this skill category?',
            )
        ) {
            return;
        }

        router.delete(route('skill-categories.destroy', category.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    Skill categories
                </h1>
            }
        >
            <Head title="Skill categories" />

            <div className="overflow-hidden">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Organize skills by category for grouping and
                            filtering.
                        </p>
                    </div>

                    <Link href={route('skill-categories.create')}>
                        <Button size="sm">New category</Button>
                    </Link>
                </div>

                {!hasCategories && (
                    <p className="text-muted-foreground text-sm">
                        No categories have been created yet.
                    </p>
                )}

                {hasCategories && (
                    <div className="bg-card overflow-hidden rounded-lg border">
                        <table className="min-w-full divide-y text-sm">
                            <thead className="bg-muted/60">
                                <tr>
                                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                                        Name
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                                        Slug
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                                        Updated at
                                    </th>
                                    <th className="text-muted-foreground px-4 py-3 text-right font-medium">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td className="px-4 py-3 align-top">
                                            <div className="font-medium">
                                                {category.name}
                                            </div>
                                        </td>
                                        <td className="text-muted-foreground px-4 py-3 align-top text-xs">
                                            {category.slug}
                                        </td>
                                        <td className="text-muted-foreground px-4 py-3 align-top text-xs whitespace-nowrap">
                                            {category.updated_at ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 align-top">
                                            <div className="flex justify-end gap-3 text-xs">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(category)
                                                    }
                                                    className="text-primary font-medium hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(event) =>
                                                        handleDelete(
                                                            category,
                                                            event,
                                                        )
                                                    }
                                                    className="text-destructive font-medium hover:underline"
                                                >
                                                    Delete
                                                </button>
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
