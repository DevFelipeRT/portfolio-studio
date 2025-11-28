// resources/js/Pages/Technologies/Partials/TechForm.tsx

import { Button } from '@/Components/Ui/button';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/Ui/select';
import { Link } from '@inertiajs/react';
import React, { JSX } from 'react';

type TechFormValues = {
    name: string;
    category: string;
};

type TechFormErrors = Record<string, string | string[] | undefined>;

type TechFormAlignment = 'right' | 'split';

interface TechFormProps {
    data: TechFormValues;
    errors: TechFormErrors;
    categories: Record<string, string>;
    processing: boolean;
    onChange(field: keyof TechFormValues, value: string): void;
    onSubmit(event: React.FormEvent<HTMLFormElement>): void;
    cancelHref: string;
    submitLabel: string;
    deleteHref?: string;
    deleteLabel?: string;
    alignActions?: TechFormAlignment;
}

/**
 * TechForm renders the reusable technology form fields and actions.
 */
export function TechForm({
    data,
    errors,
    categories,
    processing,
    onChange,
    onSubmit,
    cancelHref,
    submitLabel,
    deleteHref,
    deleteLabel = 'Delete',
    alignActions = 'right',
}: TechFormProps) {
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
                        {normalizeError(errors.name as string | string[])}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>

                <Select
                    value={data.category}
                    onValueChange={(value) => onChange('category', value)}
                >
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>

                    <SelectContent>
                        {Object.entries(categories).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {errors.category && (
                    <p className="text-destructive text-sm">
                        {normalizeError(errors.category as string | string[])}
                    </p>
                )}
            </div>

            {alignActions === 'split'
                ? renderActionsSplit()
                : renderActionsRight()}
        </form>
    );
}
