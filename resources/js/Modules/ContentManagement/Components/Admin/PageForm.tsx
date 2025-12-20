import { Button } from '@/Components/Ui/button';
import { Checkbox } from '@/Components/Ui/checkbox';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import { Textarea } from '@/Components/Ui/textarea';
import type { PageDto } from '@/Modules/ContentManagement/types';
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
    errors: Record<keyof PageFormData | string, string | string[] | undefined>;
    processing: boolean;
    onChange: (field: keyof PageFormData, value: unknown) => void;
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

    const errorFor = (field: string): string | null => {
        const raw = errors[field];

        if (Array.isArray(raw)) {
            return raw.join(' ');
        }

        if (typeof raw === 'string') {
            return raw;
        }

        return null;
    };

    return (
        <form
            onSubmit={onSubmit}
            className="bg-card space-y-6 rounded-lg border p-6 shadow-sm"
        >
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
                <div className="space-y-1.5">
                    <Label htmlFor="page-title">Title</Label>
                    <Input
                        id="page-title"
                        value={data.title}
                        onChange={(event) =>
                            onChange('title', event.target.value)
                        }
                        placeholder="Landing page"
                    />
                    {errorFor('title') && (
                        <p className="text-destructive text-xs">
                            {errorFor('title')}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="page-slug">Slug</Label>
                    <Input
                        id="page-slug"
                        value={data.slug}
                        onChange={(event) =>
                            onChange('slug', event.target.value)
                        }
                        placeholder="home, about, portfolio"
                    />
                    {errorFor('slug') && (
                        <p className="text-destructive text-xs">
                            {errorFor('slug')}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="page-internal-name">Internal name</Label>
                    <Input
                        id="page-internal-name"
                        value={data.internal_name}
                        onChange={(event) =>
                            onChange('internal_name', event.target.value)
                        }
                        placeholder="landing_home, about_me"
                    />
                    {errorFor('internal_name') && (
                        <p className="text-destructive text-xs">
                            {errorFor('internal_name')}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="page-locale">Locale</Label>
                    <Input
                        id="page-locale"
                        value={data.locale}
                        onChange={(event) =>
                            onChange('locale', event.target.value)
                        }
                        placeholder="pt_BR, en_US"
                    />
                    {errorFor('locale') && (
                        <p className="text-destructive text-xs">
                            {errorFor('locale')}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="page-layout-key">Layout key</Label>
                    <Input
                        id="page-layout-key"
                        value={data.layout_key}
                        onChange={(event) =>
                            onChange('layout_key', event.target.value)
                        }
                        placeholder="default, landing_full"
                    />
                    {errorFor('layout_key') && (
                        <p className="text-destructive text-xs">
                            {errorFor('layout_key')}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="page-meta-title">Meta title</Label>
                    <Input
                        id="page-meta-title"
                        value={data.meta_title}
                        onChange={(event) =>
                            onChange('meta_title', event.target.value)
                        }
                        placeholder="SEO title for this page"
                    />
                    {errorFor('meta_title') && (
                        <p className="text-destructive text-xs">
                            {errorFor('meta_title')}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="page-meta-description">Meta description</Label>
                <Textarea
                    id="page-meta-description"
                    value={data.meta_description}
                    onChange={(event) =>
                        onChange('meta_description', event.target.value)
                    }
                    placeholder="Short description used for SEO and social sharing."
                    rows={3}
                />
                {errorFor('meta_description') && (
                    <p className="text-destructive text-xs">
                        {errorFor('meta_description')}
                    </p>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-muted/40 flex items-start gap-2 rounded-md border px-3 py-2">
                    <Checkbox
                        id="page-is-published"
                        checked={data.is_published}
                        onCheckedChange={(checked) =>
                            onChange('is_published', Boolean(checked))
                        }
                    />
                    <div className="space-y-0.5">
                        <Label htmlFor="page-is-published">Published</Label>
                        <p className="text-muted-foreground text-xs">
                            When enabled, this page becomes publicly available.
                        </p>
                    </div>
                </div>

                <div className="bg-muted/40 flex items-start gap-2 rounded-md border px-3 py-2">
                    <Checkbox
                        id="page-is-indexable"
                        checked={data.is_indexable}
                        onCheckedChange={(checked) =>
                            onChange('is_indexable', Boolean(checked))
                        }
                    />
                    <div className="space-y-0.5">
                        <Label htmlFor="page-is-indexable">
                            Allow indexing
                        </Label>
                        <p className="text-muted-foreground text-xs">
                            Controls whether search engines should index this
                            page.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button type="submit" disabled={processing}>
                    {mode === 'create' ? 'Create page' : 'Save changes'}
                </Button>
            </div>
        </form>
    );
}
