import { Button } from '@/components/ui/button';
import {
    Form,
    CheckboxField,
    TextInputField,
    TextareaField,
    collectErroredFieldLabels,
} from '@/common/forms';
import type { FormErrors } from '@/common/forms';
import type { PageDto } from '@/modules/content-management/types';
import React from 'react';

export interface PageFormData {
    slug: string;
    internal_name: string;
    title: string;
    meta_title: string;
    meta_description: string;
    layout_key: string;
    locale: string;
    is_published: boolean;
    is_indexable: boolean;
}

interface PageFormProps {
    mode: 'create' | 'edit';
    data: PageFormData;
    errors: FormErrors<keyof PageFormData>;
    processing: boolean;
    onChange: <K extends keyof PageFormData>(
        field: K,
        value: PageFormData[K],
    ) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    page?: PageDto;
}

/**
 * Shared form for creating and editing content-managed pages.
 */
export function PageForm({
    mode,
    data,
    errors,
    processing,
    onChange,
    onSubmit,
    page,
}: PageFormProps) {
    const title = mode === 'create' ? 'Create page' : 'Edit page';
    const description =
        mode === 'create'
            ? 'Configure basic metadata for a new content-managed page.'
            : 'Update metadata and behavior of this content-managed page.';

    const summaryFields = collectErroredFieldLabels(errors, [
        { name: 'title', label: 'Title' },
        { name: 'slug', label: 'Slug' },
        { name: 'internal_name', label: 'Internal name' },
        { name: 'locale', label: 'Locale' },
        { name: 'layout_key', label: 'Layout key' },
        { name: 'meta_title', label: 'Meta title' },
        { name: 'meta_description', label: 'Meta description' },
        { name: 'is_published', label: 'Published' },
        { name: 'is_indexable', label: 'Indexable' },
    ] as const);

    return (
        <Form onSubmit={onSubmit} errors={errors} errorSummaryFields={summaryFields}>

            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold tracking-tight">
                    {title}
                </h2>
                <p className="text-muted-foreground text-sm">{description}</p>
                {mode === 'edit' && page && (
                    <p className="text-muted-foreground mt-1 text-xs">
                        Internal identifier:{' '}
                        <span className="font-mono">{page.internal_name}</span>
                    </p>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <TextInputField
                    name="title"
                    id="page-title"
                    value={data.title}
                    errors={errors}
                    label="Title"
                    required
                    errorId="page-title-error"
                    placeholder="Landing page"
                    onChange={(value) => onChange('title', value)}
                />

                <TextInputField
                    name="slug"
                    id="page-slug"
                    value={data.slug}
                    errors={errors}
                    label="Slug"
                    required
                    errorId="page-slug-error"
                    placeholder="home, about, portfolio"
                    onChange={(value) => onChange('slug', value)}
                />

                <TextInputField
                    name="internal_name"
                    id="page-internal-name"
                    value={data.internal_name}
                    errors={errors}
                    label="Internal name"
                    required
                    errorId="page-internal-name-error"
                    placeholder="landing_home, about_me"
                    onChange={(value) => onChange('internal_name', value)}
                />

                <TextInputField
                    name="locale"
                    id="page-locale"
                    value={data.locale}
                    errors={errors}
                    label="Locale"
                    required
                    errorId="page-locale-error"
                    placeholder="pt_BR, en_US"
                    onChange={(value) => onChange('locale', value)}
                />

                <TextInputField
                    name="layout_key"
                    id="page-layout-key"
                    value={data.layout_key}
                    errors={errors}
                    label="Layout key"
                    errorId="page-layout-key-error"
                    placeholder="default, landing_full"
                    onChange={(value) => onChange('layout_key', value)}
                />

                <TextInputField
                    name="meta_title"
                    id="page-meta-title"
                    value={data.meta_title}
                    errors={errors}
                    label="Meta title"
                    errorId="page-meta-title-error"
                    placeholder="SEO title for this page"
                    onChange={(value) => onChange('meta_title', value)}
                />
            </div>

            <TextareaField
                name="meta_description"
                id="page-meta-description"
                value={data.meta_description}
                errors={errors}
                label="Meta description"
                errorId="page-meta-description-error"
                placeholder="Short description used for SEO and social sharing."
                rows={3}
                onChange={(value) => onChange('meta_description', value)}
            />

            <div className="grid gap-4 md:grid-cols-2">
                <CheckboxField
                    name="is_published"
                    id="page-is-published"
                    value={data.is_published}
                    errors={errors}
                    label="Published"
                    className="bg-muted/40 rounded-md border px-3 py-2"
                    onChange={(value) => onChange('is_published', value)}
                />

                <CheckboxField
                    name="is_indexable"
                    id="page-is-indexable"
                    value={data.is_indexable}
                    errors={errors}
                    label="Allow indexing"
                    className="bg-muted/40 rounded-md border px-3 py-2"
                    onChange={(value) => onChange('is_indexable', value)}
                />
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button type="submit" disabled={processing}>
                    {mode === 'create' ? 'Create page' : 'Save changes'}
                </Button>
            </div>
        </Form>
    );
}
