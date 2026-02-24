import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useSupportedLocales } from '@/common/i18n';
import {
    FormField,
    FormErrorSummary,
    collectErroredFieldLabels,
    type FormErrors,
} from '@/common/forms';
import type { SkillCategoryFormData } from '@/modules/skills/core/forms';
import { Link } from '@inertiajs/react';
import React, { JSX } from 'react';

type SkillCategoryFormAlignment = 'right' | 'split';

interface SkillCategoryFormProps {
    data: SkillCategoryFormData;
    errors: FormErrors<keyof SkillCategoryFormData>;
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
    const supportedLocales = useSupportedLocales();
    const summaryFields = collectErroredFieldLabels(errors, [
        { name: 'locale', label: 'Locale' },
        { name: 'name', label: 'Name' },
        { name: 'slug', label: 'Slug' },
    ] as const);

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
            <FormErrorSummary fields={summaryFields} />

            <FormField
                name="locale"
                errors={errors}
                htmlFor="locale"
                label="Locale"
                required
            >
                {({ a11yAttributes, getSelectClassName }) => (
                    <Select
                        value={data.locale}
                        onValueChange={(value) => onChange('locale', value)}
                        disabled={processing}
                    >
                        <SelectTrigger
                            id="locale"
                            className={getSelectClassName()}
                            {...a11yAttributes}
                        >
                            <SelectValue placeholder="Select a locale" />
                        </SelectTrigger>
                        <SelectContent>
                            {supportedLocales.map((locale) => (
                                <SelectItem key={locale} value={locale}>
                                    {locale}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </FormField>

            <FormField
                name="name"
                errors={errors}
                htmlFor="name"
                label="Name"
                required
            >
                {({ a11yAttributes, getInputClassName }) => (
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(event) => onChange('name', event.target.value)}
                        autoFocus
                        className={getInputClassName()}
                        {...a11yAttributes}
                    />
                )}
            </FormField>

            <FormField
                name="slug"
                errors={errors}
                htmlFor="slug"
                label="Slug"
            >
                {({ a11yAttributes, getInputClassName }) => (
                    <Input
                        id="slug"
                        value={data.slug}
                        onChange={(event) => onChange('slug', event.target.value)}
                        placeholder="Leave blank to auto-generate"
                        className={getInputClassName()}
                        {...a11yAttributes}
                    />
                )}
            </FormField>

            {alignActions === 'split'
                ? renderActionsSplit()
                : renderActionsRight()}
        </form>
    );
}
