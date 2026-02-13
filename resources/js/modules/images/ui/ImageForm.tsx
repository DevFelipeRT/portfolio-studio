import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link, useForm } from '@inertiajs/react';
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

    const { data, setData, post, put, processing, errors, transform } =
        useForm<ImageFormData>(initial);

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
                const { file, ...rest } = current;
                return rest as unknown as ImageFormData;
            }

            return current;
        });

        if (!isEditMode) {
            post(submitRoute, {
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            put(submitRoute, {
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
            {mode === 'create' && (
                <section className="space-y-4">
                    <h2 className="text-lg font-medium">Image file</h2>

                    <div className="space-y-1.5">
                        <Label htmlFor="image-file">File</Label>
                        <Input
                            id="image-file"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {errors.file && (
                            <p className="text-destructive text-sm">
                                {normalizeError(errors.file)}
                            </p>
                        )}
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
                        <Label htmlFor="image-title">Title</Label>
                        <Input
                            id="image-title"
                            value={data.image_title}
                            onChange={(event) =>
                                setData('image_title', event.target.value)
                            }
                        />
                        {errors.image_title && (
                            <p className="text-destructive text-sm">
                                {normalizeError(errors.image_title)}
                            </p>
                        )}
                        <p className="text-muted-foreground text-xs">
                            Optional title used when displaying the image in
                            more prominent contexts.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="image-alt-text">Alt text</Label>
                        <Input
                            id="image-alt-text"
                            value={data.alt_text}
                            onChange={(event) =>
                                setData('alt_text', event.target.value)
                            }
                        />
                        {errors.alt_text && (
                            <p className="text-destructive text-sm">
                                {normalizeError(errors.alt_text)}
                            </p>
                        )}
                        <p className="text-muted-foreground text-xs">
                            Short, descriptive text used for accessibility and
                            when the image cannot be displayed.
                        </p>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="image-caption">Caption</Label>
                    <Textarea
                        id="image-caption"
                        rows={3}
                        value={data.caption}
                        onChange={(event) =>
                            setData('caption', event.target.value)
                        }
                    />
                    {errors.caption && (
                        <p className="text-destructive text-sm">
                            {normalizeError(errors.caption)}
                        </p>
                    )}
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
