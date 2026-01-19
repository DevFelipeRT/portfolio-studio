import { Button } from '@/Components/Ui/button';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import { Link } from '@inertiajs/react';
import React, { JSX } from 'react';

type SkillCategoryFormErrors = Record<string, string | string[] | undefined>;

type SkillCategoryFormAlignment = 'right' | 'split';

interface SkillCategoryFormProps {
    data: SkillCategoryFormData;
    errors: SkillCategoryFormErrors;
    processing: boolean;
    onChange(field: keyof SkillCategoryFormData, value: string): void;
    onSubmit(event: React.FormEvent<HTMLFormElement>): void;
    cancelHref: string;
    submitLabel: string;
    deleteHref?: string;
    deleteLabel?: string;
    alignActions?: SkillCategoryFormAlignment;
}

/**
 * SkillCategoryForm renders the reusable skill category form fields.
 */
export function SkillCategoryForm({
    data,
    errors,
    processing,
    onChange,
    onSubmit,
    cancelHref,
    submitLabel,
    deleteHref,
    deleteLabel = 'Delete',
    alignActions = 'right',
}: SkillCategoryFormProps) {
    const normalizeError = (
        message: string | string[] | undefined,
    ): string | null => {
        if (!message) {
            return null;
        }

        if (Array.isArray(message)) {
            return message.join(' ');
        }

        return message;
    };

    const renderActionsRight = (): JSX.Element => (
        <div className="flex items-center justify-end gap-3">
            <Link
                href={cancelHref}
                className="text-muted-foreground hover:text-foreground text-sm"
            >
                Cancel
            </Link>

            <Button type="submit" disabled={processing}>
                {submitLabel}
            </Button>
        </div>
    );

    const renderActionsSplit = (): JSX.Element => (
        <div className="flex items-center justify-between gap-3">
            <Link
                href={cancelHref}
                className="text-muted-foreground hover:text-foreground text-sm"
            >
                Cancel
            </Link>

            <div className="flex items-center gap-3">
                {deleteHref && (
                    <Link
                        href={deleteHref}
                        method="delete"
                        as="button"
                        className="text-destructive text-sm hover:underline"
                    >
                        {deleteLabel}
                    </Link>
                )}

                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
            </div>
        </div>
    );

    return (
        <form
            onSubmit={onSubmit}
            className="bg-card space-y-6 rounded-lg border p-6 shadow-sm"
        >
            <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(event) => onChange('name', event.target.value)}
                    autoFocus
                />
                {errors.name && (
                    <p className="text-destructive text-sm">
                        {normalizeError(errors.name)}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="slug">Slug</Label>
                <Input
                    id="slug"
                    value={data.slug}
                    onChange={(event) => onChange('slug', event.target.value)}
                    placeholder="Leave blank to auto-generate"
                />
                {errors.slug && (
                    <p className="text-destructive text-sm">
                        {normalizeError(errors.slug)}
                    </p>
                )}
            </div>

            {alignActions === 'split'
                ? renderActionsSplit()
                : renderActionsRight()}
        </form>
    );
}
