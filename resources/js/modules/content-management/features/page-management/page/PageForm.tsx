import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormField,
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
                <FormField
                    name="title"
                    errors={errors}
                    htmlFor="page-title"
                    label="Title"
                    required
                    errorId="page-title-error"
                >
                    {({ a11yAttributes, getInputClassName }) => (
                        <Input
                            id="page-title"
                            value={data.title}
                            onChange={(event) =>
                                onChange('title', event.target.value)
                            }
                            placeholder="Landing page"
                            className={getInputClassName()}
                            {...a11yAttributes}
                        />
                    )}
                </FormField>

                <FormField
                    name="slug"
                    errors={errors}
                    htmlFor="page-slug"
                    label="Slug"
                    required
                    errorId="page-slug-error"
                >
                    {({ a11yAttributes, getInputClassName }) => (
                        <Input
                            id="page-slug"
                            value={data.slug}
                            onChange={(event) =>
                                onChange('slug', event.target.value)
                            }
                            placeholder="home, about, portfolio"
                            className={getInputClassName()}
                            {...a11yAttributes}
                        />
                    )}
                </FormField>

                <FormField
                    name="internal_name"
                    errors={errors}
                    htmlFor="page-internal-name"
                    label="Internal name"
                    required
                    errorId="page-internal-name-error"
                >
                    {({ a11yAttributes, getInputClassName }) => (
                        <Input
                            id="page-internal-name"
                            value={data.internal_name}
                            onChange={(event) =>
                                onChange('internal_name', event.target.value)
                            }
                            placeholder="landing_home, about_me"
                            className={getInputClassName()}
                            {...a11yAttributes}
                        />
                    )}
                </FormField>

                <FormField
                    name="locale"
                    errors={errors}
                    htmlFor="page-locale"
                    label="Locale"
                    required
                    errorId="page-locale-error"
                >
                    {({ a11yAttributes, getInputClassName }) => (
                        <Input
                            id="page-locale"
                            value={data.locale}
                            onChange={(event) =>
                                onChange('locale', event.target.value)
                            }
                            placeholder="pt_BR, en_US"
                            className={getInputClassName()}
                            {...a11yAttributes}
                        />
                    )}
                </FormField>

                <FormField
                    name="layout_key"
                    errors={errors}
                    htmlFor="page-layout-key"
                    label="Layout key"
                    errorId="page-layout-key-error"
                >
                    {({ a11yAttributes, getInputClassName }) => (
                        <Input
                            id="page-layout-key"
                            value={data.layout_key}
                            onChange={(event) =>
                                onChange('layout_key', event.target.value)
                            }
                            placeholder="default, landing_full"
                            className={getInputClassName()}
                            {...a11yAttributes}
                        />
                    )}
                </FormField>

                <FormField
                    name="meta_title"
                    errors={errors}
                    htmlFor="page-meta-title"
                    label="Meta title"
                    errorId="page-meta-title-error"
                >
                    {({ a11yAttributes, getInputClassName }) => (
                        <Input
                            id="page-meta-title"
                            value={data.meta_title}
                            onChange={(event) =>
                                onChange('meta_title', event.target.value)
                            }
                            placeholder="SEO title for this page"
                            className={getInputClassName()}
                            {...a11yAttributes}
                        />
                    )}
                </FormField>
            </div>

            <FormField
                name="meta_description"
                errors={errors}
                htmlFor="page-meta-description"
                label="Meta description"
                errorId="page-meta-description-error"
            >
                {({ a11yAttributes, getInputClassName }) => (
                    <Textarea
                        id="page-meta-description"
                        value={data.meta_description}
                        onChange={(event) =>
                            onChange('meta_description', event.target.value)
                        }
                        placeholder="Short description used for SEO and social sharing."
                        rows={3}
                        className={getInputClassName()}
                        {...a11yAttributes}
                    />
                )}
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
                <FormField
                    name="is_published"
                    errors={errors}
                    htmlFor="page-is-published"
                    label="Published"
                    variant="inline"
                    className="bg-muted/40 rounded-md border px-3 py-2"
                >
                    {({ a11yAttributes }) => (
                        <Checkbox
                            id="page-is-published"
                            checked={data.is_published}
                            onCheckedChange={(checked) =>
                                onChange('is_published', Boolean(checked))
                            }
                            {...a11yAttributes}
                        />
                    )}
                </FormField>

                <FormField
                    name="is_indexable"
                    errors={errors}
                    htmlFor="page-is-indexable"
                    label="Allow indexing"
                    variant="inline"
                    className="bg-muted/40 rounded-md border px-3 py-2"
                >
                    {({ a11yAttributes }) => (
                        <Checkbox
                            id="page-is-indexable"
                            checked={data.is_indexable}
                            onCheckedChange={(checked) =>
                                onChange('is_indexable', Boolean(checked))
                            }
                            {...a11yAttributes}
                        />
                    )}
                </FormField>
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button type="submit" disabled={processing}>
                    {mode === 'create' ? 'Create page' : 'Save changes'}
                </Button>
            </div>
        </Form>
    );
}
