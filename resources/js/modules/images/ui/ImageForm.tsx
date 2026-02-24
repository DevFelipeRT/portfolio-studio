import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    FormField,
    FormErrorSummary,
    collectErroredFieldLabels,
    type FormErrors,
} from '@/common/forms';
import { Link, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import type { Image } from '@/modules/images/core/types';

type ImageFormMode = 'create' | 'edit';

type ImageFormData = {
    file: File | null;
    alt_text: string;
    image_title: string;
    caption: string;
};

type ImageFormProps = {
    mode: ImageFormMode;
    submitRoute: string;
    backRoute: string;
    image?: Image;
};

/**
 * Form component used to create a new image (with upload)
 * or update global metadata of an existing image.
 */
export function ImageForm({
    mode,
    submitRoute,
    backRoute,
    image,
}: ImageFormProps) {
    const isEditMode = mode === 'edit';

    const defaultValues: ImageFormData = {
        file: null,
        alt_text: '',
        image_title: '',
        caption: '',
    };

    const initial: ImageFormData =
        isEditMode && image
            ? {
                  file: null,
                  alt_text: image.alt_text ?? '',
                  image_title: image.image_title ?? '',
                  caption: image.caption ?? '',
              }
            : defaultValues;

    const { data, setData, post, put, processing, transform } =
        useForm<ImageFormData>(initial);

    const { errors: pageErrors } = usePage().props as {
        errors: FormErrors<keyof ImageFormData>;
    };

    const summaryFields = collectErroredFieldLabels(pageErrors, [
        { name: 'file', label: 'File' },
        { name: 'image_title', label: 'Title' },
        { name: 'alt_text', label: 'Alt text' },
        { name: 'caption', label: 'Caption' },
    ] as const);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const file = event.target.files?.[0] ?? null;
        setData('file', file);
    };

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        transform((current: ImageFormData) => {
            if (isEditMode) {
                const { alt_text, image_title, caption } = current;
                return { alt_text, image_title, caption } as ImageFormData;
            }

            return current;
        });

        if (!isEditMode) {
            post(submitRoute, {
                forceFormData: true,
                preserveState: true,
                preserveScroll: true,
            });
        } else {
            put(submitRoute, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const submitLabel =
        mode === 'create' ? 'Save image' : 'Update image metadata';

    return (
        <form
            onSubmit={submit}
            className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
        >
            <FormErrorSummary fields={summaryFields} />

            {mode === 'create' && (
                <section className="space-y-4">
                    <h2 className="text-lg font-medium">Image file</h2>

                    <FormField
                        name="file"
                        errors={pageErrors}
                        htmlFor="image-file"
                        label="File"
                        required
                        errorId="image-file-error"
                    >
                        {({ a11yAttributes, getInputClassName }) => (
                            <Input
                                id="image-file"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className={getInputClassName()}
                                {...a11yAttributes}
                            />
                        )}
                    </FormField>
                    <div className="space-y-1.5">
                        <p className="text-muted-foreground text-xs">
                            Choose an image file to upload. Supported types will
                            be validated on the server.
                        </p>
                    </div>
                </section>
            )}

            {mode === 'edit' && image && (
                <section className="space-y-4">
                    <h2 className="text-lg font-medium">Current image</h2>

                    <div className="grid gap-4 md:grid-cols-[minmax(0,2fr),minmax(0,3fr)]">
                        <figure className="bg-muted/40 overflow-hidden rounded-md border">
                            {image.url ? (
                                <img
                                    src={image.url}
                                    alt={image.alt_text ?? ''}
                                    className="h-48 w-full object-contain"
                                />
                            ) : (
                                <div className="text-muted-foreground flex h-48 items-center justify-center text-xs">
                                    No preview available for this image.
                                </div>
                            )}
                        </figure>

                        <div className="text-muted-foreground space-y-2 text-xs">
                            <p>
                                <span className="font-medium">
                                    Original filename:
                                </span>{' '}
                                {image.original_filename ?? '—'}
                            </p>
                            <p>
                                <span className="font-medium">MIME type:</span>{' '}
                                {image.mime_type ?? '—'}
                            </p>
                            <p>
                                <span className="font-medium">Dimensions:</span>{' '}
                                {formatDimensions(
                                    image.image_width,
                                    image.image_height,
                                ) ?? '—'}
                            </p>
                            <p>
                                <span className="font-medium">File size:</span>{' '}
                                {formatFileSize(image.file_size_bytes) ?? '—'}
                            </p>
                            <p>
                                <span className="font-medium">Storage:</span>{' '}
                                {image.storage_disk ?? '—'}
                                {image.storage_path && (
                                    <>
                                        {' · '}
                                        <span className="font-mono text-[0.7rem]">
                                            {image.storage_path}
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            <section className="space-y-4">
                <h2 className="text-lg font-medium">Metadata</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <FormField
                            name="image_title"
                            errors={pageErrors}
                            htmlFor="image-title"
                            label="Title"
                            errorId="image-title-error"
                        >
                            {({ a11yAttributes, getInputClassName }) => (
                                <Input
                                    id="image-title"
                                    value={data.image_title}
                                    onChange={(event) =>
                                        setData('image_title', event.target.value)
                                    }
                                    className={getInputClassName()}
                                    {...a11yAttributes}
                                />
                            )}
                        </FormField>
                        <p className="text-muted-foreground text-xs">
                            Optional title used when displaying the image in
                            more prominent contexts.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <FormField
                            name="alt_text"
                            errors={pageErrors}
                            htmlFor="image-alt-text"
                            label="Alt text"
                            required
                            errorId="image-alt-text-error"
                        >
                            {({ a11yAttributes, getInputClassName }) => (
                                <Input
                                    id="image-alt-text"
                                    value={data.alt_text}
                                    onChange={(event) =>
                                        setData('alt_text', event.target.value)
                                    }
                                    className={getInputClassName()}
                                    {...a11yAttributes}
                                />
                            )}
                        </FormField>
                        <p className="text-muted-foreground text-xs">
                            Short, descriptive text used for accessibility and
                            when the image cannot be displayed.
                        </p>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <FormField
                        name="caption"
                        errors={pageErrors}
                        htmlFor="image-caption"
                        label="Caption"
                        errorId="image-caption-error"
                    >
                        {({ a11yAttributes, getInputClassName }) => (
                            <Textarea
                                id="image-caption"
                                rows={3}
                                value={data.caption}
                                onChange={(event) =>
                                    setData('caption', event.target.value)
                                }
                                className={getInputClassName()}
                                {...a11yAttributes}
                            />
                        )}
                    </FormField>
                    <p className="text-muted-foreground text-xs">
                        Longer, optional description that may be shown below the
                        image in galleries or detail views.
                    </p>
                </div>
            </section>

            <section className="flex items-center justify-between border-t pt-4">
                <Link
                    href={backRoute}
                    className="text-muted-foreground hover:text-foreground text-sm"
                >
                    Back to images
                </Link>

                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
            </section>
        </form>
    );
}

function formatFileSize(bytes: number | null | undefined): string | null {
    if (bytes == null || Number.isNaN(bytes)) {
        return null;
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const kb = bytes / 1024;
    if (kb < 1024) {
        return `${kb.toFixed(1)} KB`;
    }

    const mb = kb / 1024;
    if (mb < 1024) {
        return `${mb.toFixed(2)} MB`;
    }

    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
}

function formatDimensions(
    width: number | null | undefined,
    height: number | null | undefined,
): string | null {
    if (
        width == null ||
        height == null ||
        Number.isNaN(width) ||
        Number.isNaN(height)
    ) {
        return null;
    }

    return `${width} × ${height}px`;
}
