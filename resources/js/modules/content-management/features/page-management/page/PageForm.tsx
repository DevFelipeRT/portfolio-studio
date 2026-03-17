import { Button } from '@/components/ui/button';
import {
    Form,
    CheckboxField,
    TextInputField,
    TextareaField,
    collectErroredFieldLabels,
} from '@/common/forms';
import type { FormErrors } from '@/common/forms';
import {
    CONTENT_MANAGEMENT_NAMESPACES,
    useContentManagementTranslation,
} from '@/modules/content-management/i18n';
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
    const { translate: tPages } = useContentManagementTranslation(
        CONTENT_MANAGEMENT_NAMESPACES.pages,
    );
    const { translate: tActions } = useContentManagementTranslation(
        CONTENT_MANAGEMENT_NAMESPACES.actions,
    );
    const title =
        mode === 'create'
            ? tPages('form.createTitle', 'Create page')
            : tPages('form.editTitle', 'Edit page');
    const description =
        mode === 'create'
            ? tPages(
                  'form.createDescription',
                  'Configure basic metadata for a new content-managed page.',
              )
            : tPages(
                  'form.editDescription',
                  'Update metadata and behavior of this content-managed page.',
              );

    const summaryFields = collectErroredFieldLabels(errors, [
        { name: 'title', label: tPages('form.fields.title', 'Title') },
        { name: 'slug', label: tPages('form.fields.slug', 'Slug') },
        {
            name: 'internal_name',
            label: tPages('form.fields.internalName', 'Internal name'),
        },
        { name: 'locale', label: tPages('form.fields.locale', 'Locale') },
        {
            name: 'layout_key',
            label: tPages('form.fields.layoutKey', 'Layout key'),
        },
        {
            name: 'meta_title',
            label: tPages('form.fields.metaTitle', 'Meta title'),
        },
        {
            name: 'meta_description',
            label: tPages('form.fields.metaDescription', 'Meta description'),
        },
        {
            name: 'is_published',
            label: tPages('form.fields.published', 'Published'),
        },
        {
            name: 'is_indexable',
            label: tPages('form.fields.indexable', 'Indexable'),
        },
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
                        {tPages('form.internalIdentifier', 'Internal identifier:')}{' '}
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
                    label={tPages('form.fields.title', 'Title')}
                    required
                    errorId="page-title-error"
                    placeholder={tPages('form.placeholders.title', 'Landing page')}
                    onChange={(value) => onChange('title', value)}
                />

                <TextInputField
                    name="slug"
                    id="page-slug"
                    value={data.slug}
                    errors={errors}
                    label={tPages('form.fields.slug', 'Slug')}
                    required
                    errorId="page-slug-error"
                    placeholder={tPages(
                        'form.placeholders.slug',
                        'home, about, portfolio',
                    )}
                    onChange={(value) => onChange('slug', value)}
                />

                <TextInputField
                    name="internal_name"
                    id="page-internal-name"
                    value={data.internal_name}
                    errors={errors}
                    label={tPages('form.fields.internalName', 'Internal name')}
                    required
                    errorId="page-internal-name-error"
                    placeholder={tPages(
                        'form.placeholders.internalName',
                        'landing_home, about_me',
                    )}
                    onChange={(value) => onChange('internal_name', value)}
                />

                <TextInputField
                    name="locale"
                    id="page-locale"
                    value={data.locale}
                    errors={errors}
                    label={tPages('form.fields.locale', 'Locale')}
                    required
                    errorId="page-locale-error"
                    placeholder={tPages(
                        'form.placeholders.locale',
                        'pt_BR, en_US',
                    )}
                    onChange={(value) => onChange('locale', value)}
                />

                <TextInputField
                    name="layout_key"
                    id="page-layout-key"
                    value={data.layout_key}
                    errors={errors}
                    label={tPages('form.fields.layoutKey', 'Layout key')}
                    errorId="page-layout-key-error"
                    placeholder={tPages(
                        'form.placeholders.layoutKey',
                        'default, landing_full',
                    )}
                    onChange={(value) => onChange('layout_key', value)}
                />

                <TextInputField
                    name="meta_title"
                    id="page-meta-title"
                    value={data.meta_title}
                    errors={errors}
                    label={tPages('form.fields.metaTitle', 'Meta title')}
                    errorId="page-meta-title-error"
                    placeholder={tPages(
                        'form.placeholders.metaTitle',
                        'SEO title for this page',
                    )}
                    onChange={(value) => onChange('meta_title', value)}
                />
            </div>

            <TextareaField
                name="meta_description"
                id="page-meta-description"
                value={data.meta_description}
                errors={errors}
                label={tPages('form.fields.metaDescription', 'Meta description')}
                errorId="page-meta-description-error"
                placeholder={tPages(
                    'form.placeholders.metaDescription',
                    'Short description used for SEO and social sharing.',
                )}
                rows={3}
                onChange={(value) => onChange('meta_description', value)}
            />

            <div className="grid gap-4 md:grid-cols-2">
                <CheckboxField
                    name="is_published"
                    id="page-is-published"
                    value={data.is_published}
                    errors={errors}
                    label={tPages('form.fields.published', 'Published')}
                    className="bg-muted/40 rounded-md border px-3 py-2"
                    onChange={(value) => onChange('is_published', value)}
                />

                <CheckboxField
                    name="is_indexable"
                    id="page-is-indexable"
                    value={data.is_indexable}
                    errors={errors}
                    label={tPages('form.fields.allowIndexing', 'Allow indexing')}
                    className="bg-muted/40 rounded-md border px-3 py-2"
                    onChange={(value) => onChange('is_indexable', value)}
                />
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button type="submit" disabled={processing}>
                    {mode === 'create'
                        ? tPages('form.submitCreate', 'Create page')
                        : tActions('saveChanges', 'Save changes')}
                </Button>
            </div>
        </Form>
    );
}
