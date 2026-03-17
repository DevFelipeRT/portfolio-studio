import { Button } from '@/components/ui/button';
import { PageLink, pageRouter } from '@/common/page-runtime';
import type { SkillCategory } from '@/modules/skills/core/types';
import { SKILLS_NAMESPACES, useSkillsTranslation } from '@/modules/skills/i18n';
import React from 'react';

type SkillCategoriesSectionProps = {
    categories: SkillCategory[];
    title?: string;
    description?: string;
};

export function SkillCategoriesSection({
    categories,
    title = 'Skill categories',
    description = 'Organize skills by category for grouping and filtering.',
}: SkillCategoriesSectionProps) {
    const { translate: tActions } = useSkillsTranslation(SKILLS_NAMESPACES.actions);
    const { translate: tForm } = useSkillsTranslation(SKILLS_NAMESPACES.form);
    const hasCategories = categories.length > 0;
    const effectiveTitle = title === 'Skill categories'
        ? tForm('sections.categoriesTitle')
        : title;
    const effectiveDescription =
        description === 'Organize skills by category for grouping and filtering.'
            ? tForm('help.categoriesDescription')
            : description;

    const handleEdit = (category: SkillCategory): void => {
        pageRouter.get(route('skill-categories.edit', category.id));
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

        pageRouter.delete(route('skill-categories.destroy', category.id));
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                        {effectiveTitle}
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {effectiveDescription}
                    </p>
                </div>

                <PageLink href={route('skill-categories.create')}>
                    <Button size="sm" variant="secondary">
                        {tActions('newCategory')}
                    </Button>
                </PageLink>
            </div>

            {!hasCategories && (
                <p className="text-muted-foreground text-sm">
                    {tForm('emptyState.categories')}
                </p>
            )}

            {hasCategories && (
                <div className="bg-card overflow-hidden rounded-lg border">
                    <table className="min-w-full divide-y text-sm">
                        <thead className="bg-muted/60">
                            <tr>
                                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                                    {tForm('fields.name.label')}
                                </th>
                                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                                    {tForm('fields.slug.label')}
                                </th>
                                <th className="text-muted-foreground px-4 py-3 text-left font-medium">
                                    {tForm('fields.updated_at.label')}
                                </th>
                                <th className="text-muted-foreground px-4 py-3 text-right font-medium">
                                    {tForm('fields.actions.label')}
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
                                        {category.updated_at ?? tForm('values.empty')}
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <div className="flex justify-end gap-3 text-xs">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(category)}
                                                className="text-primary font-medium hover:underline"
                                            >
                                                {tActions('editSkillCategory')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(event) =>
                                                    handleDelete(category, event)
                                                }
                                                className="text-destructive font-medium hover:underline"
                                            >
                                                {tActions('delete')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
