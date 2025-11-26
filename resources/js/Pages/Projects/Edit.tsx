import { Button } from '@/Components/Ui/button';
import { Checkbox } from '@/Components/Ui/checkbox';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import { Textarea } from '@/Components/Ui/textarea';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import {
    Project,
    ProjectImage,
    Technology,
} from '../types';

interface EditProjectProps {
    project: Project;
    technologies: Technology[];
}

/**
 * Edit project form with support for uploading new images.
 *
 * Existing images stored in the project are not edited here. New uploads
 * are sent as multipart data and processed by the backend service.
 */
export default function Edit({ project, technologies }: EditProjectProps) {
    const existingImages: ProjectImage[] = project.images ?? [];

    const initialTechnologyIds: number[] = project.technologies.map(
        (tech: Technology) => tech.id,
    );

    const { data, setData, post, processing, errors, transform } =
        useForm<ProjectFormData>({
            name: project.name,
            short_description: project.short_description,
            long_description: project.long_description,
            status: project.status,
            repository_url: project.repository_url ?? '',
            live_url: project.live_url ?? '',
            display: project.display,
            technology_ids: initialTechnologyIds,
            images: [],
        });

    function toggleTechnology(id: number): void {
        setData((current: ProjectFormData) => {
            const exists = current.technology_ids.includes(id);

            return {
                ...current,
                technology_ids: exists
                    ? current.technology_ids.filter(
                          (item: number) => item !== id,
                      )
                    : [...current.technology_ids, id],
            };
        });
    }

    function addImageRow(): void {
        setData((current: ProjectFormData) => ({
            ...current,
            images: [
                ...current.images,
                {
                    file: null,
                    alt: '',
                } as ImageInput,
            ],
        }));
    }

    function removeImageRow(index: number): void {
        setData((current: ProjectFormData) => ({
            ...current,
            images: current.images.filter((_image, i) => i !== index),
        }));
    }

    function updateImageAlt(index: number, value: string): void {
        setData((current: ProjectFormData) => ({
            ...current,
            images: current.images.map((image, i) =>
                i === index ? { ...image, alt: value } : image,
            ),
        }));
    }

    function updateImageFile(
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ): void {
        const file = event.target.files?.[0] ?? null;

        setData((current: ProjectFormData) => ({
            ...current,
            images: current.images.map((image, i) =>
                i === index ? { ...image, file } : image,
            ),
        }));
    }

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        transform((formData) => ({
            ...formData,
            _method: 'put',
        }));

        post(route('projects.update', project.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    function normalizeError(
        message: string | string[] | undefined,
    ): string | null {
        if (!message) {
            return null;
        }

        if (Array.isArray(message)) {
            return message.join(' ');
        }

        return message;
    }

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl leading-tight font-semibold">
                    Edit project
                </h1>
            }
        >
            <Head title={`Edit project: ${project.name}`} />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                    <div className="mb-4">
                        <Link
                            href={route('projects.index')}
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Back to projects
                        </Link>
                    </div>

                    <form
                        onSubmit={submit}
                        className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
                    >
                        <section className="space-y-4">
                            <h2 className="text-lg font-medium">
                                Basic information
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(event) =>
                                            setData('name', event.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-destructive text-sm">
                                            {normalizeError(errors.name)}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="status">Status</Label>
                                    <Input
                                        id="status"
                                        value={data.status}
                                        onChange={(event) =>
                                            setData(
                                                'status',
                                                event.target.value,
                                            )
                                        }
                                    />
                                    {errors.status && (
                                        <p className="text-destructive text-sm">
                                            {normalizeError(errors.status)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="short_description">
                                    Short description
                                </Label>
                                <Input
                                    id="short_description"
                                    value={data.short_description}
                                    onChange={(event) =>
                                        setData(
                                            'short_description',
                                            event.target.value,
                                        )
                                    }
                                />
                                {errors.short_description && (
                                    <p className="text-destructive text-sm">
                                        {normalizeError(
                                            errors.short_description,
                                        )}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="long_description">
                                    Long description
                                </Label>
                                <Textarea
                                    id="long_description"
                                    value={data.long_description}
                                    onChange={(event) =>
                                        setData(
                                            'long_description',
                                            event.target.value,
                                        )
                                    }
                                    rows={6}
                                />
                                {errors.long_description && (
                                    <p className="text-destructive text-sm">
                                        {normalizeError(
                                            errors.long_description,
                                        )}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="display"
                                    checked={data.display}
                                    onCheckedChange={(checked) => {
                                        setData('display', !!checked);
                                    }}
                                />
                                <label
                                    htmlFor="display"
                                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Display on landing
                                </label>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-medium">Links</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="repository_url">
                                        Repository URL
                                    </Label>
                                    <Input
                                        id="repository_url"
                                        value={data.repository_url}
                                        onChange={(event) =>
                                            setData(
                                                'repository_url',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="https://"
                                    />
                                    {errors.repository_url && (
                                        <p className="text-destructive text-sm">
                                            {normalizeError(
                                                errors.repository_url,
                                            )}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="live_url">Live URL</Label>
                                    <Input
                                        id="live_url"
                                        value={data.live_url}
                                        onChange={(event) =>
                                            setData(
                                                'live_url',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="https://"
                                    />
                                    {errors.live_url && (
                                        <p className="text-destructive text-sm">
                                            {normalizeError(errors.live_url)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-medium">
                                Technologies
                            </h2>

                            <div className="bg-background rounded-md border p-4">
                                {technologies.length === 0 && (
                                    <p className="text-muted-foreground text-sm">
                                        No technologies available.
                                    </p>
                                )}

                                {technologies.length > 0 && (
                                    <div className="grid gap-2 md:grid-cols-3">
                                        {technologies.map(
                                            (technology: Technology) => {
                                                const checked =
                                                    data.technology_ids.includes(
                                                        technology.id,
                                                    );

                                                return (
                                                    <label
                                                        key={technology.id}
                                                        className="bg-card flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="border-muted-foreground h-4 w-4 rounded"
                                                            checked={checked}
                                                            onChange={() =>
                                                                toggleTechnology(
                                                                    technology.id,
                                                                )
                                                            }
                                                        />
                                                        <span>
                                                            {technology.name}
                                                        </span>
                                                    </label>
                                                );
                                            },
                                        )}
                                    </div>
                                )}
                            </div>

                            {errors.technology_ids && (
                                <p className="text-destructive text-sm">
                                    {normalizeError(errors.technology_ids)}
                                </p>
                            )}
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-lg font-medium">Images</h2>

                            <div className="space-y-6">
                                {/* Existing images */}
                                {existingImages.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">
                                            Existing images
                                        </p>

                                        <div className="grid gap-3 md:grid-cols-3">
                                            {existingImages.map((image) => (
                                                <figure
                                                    key={image.id}
                                                    className="bg-background flex flex-col gap-2 rounded-md border p-3"
                                                >
                                                    <img
                                                        src={route(
                                                            'storage.local',
                                                            { path: image.src },
                                                        )}
                                                        alt={image.alt ?? ''}
                                                        className="h-32 w-full rounded-md object-cover"
                                                    />
                                                    {image.alt && (
                                                        <figcaption className="text-muted-foreground text-xs">
                                                            {image.alt}
                                                        </figcaption>
                                                    )}

                                                    <div className="flex justify-end">
                                                        <Link
                                                            href={route(
                                                                'projects.images.destroy',
                                                                {
                                                                    project:
                                                                        project.id,
                                                                    image: image.id,
                                                                },
                                                            )}
                                                            method="delete"
                                                            as="button"
                                                            className="text-destructive text-xs hover:underline"
                                                        >
                                                            Delete image
                                                        </Link>
                                                    </div>
                                                </figure>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New images to upload */}
                                <div className="space-y-3">
                                    {data.images.length === 0 &&
                                        existingImages.length === 0 && (
                                            <p className="text-muted-foreground text-sm">
                                                No images added yet.
                                            </p>
                                        )}

                                    {data.images.length === 0 &&
                                        existingImages.length > 0 && (
                                            <p className="text-muted-foreground text-sm">
                                                No new images selected. Existing
                                                images are listed above.
                                            </p>
                                        )}

                                    {data.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className="bg-background grid gap-3 rounded-md border p-3 md:grid-cols-[2fr,2fr,auto]"
                                        >
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`image-file-${index}`}
                                                >
                                                    Image file
                                                </Label>
                                                <Input
                                                    id={`image-file-${index}`}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(event) =>
                                                        updateImageFile(
                                                            index,
                                                            event,
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor={`image-alt-${index}`}
                                                >
                                                    Alt text (optional)
                                                </Label>
                                                <Input
                                                    id={`image-alt-${index}`}
                                                    value={image.alt ?? ''}
                                                    onChange={(event) =>
                                                        updateImageAlt(
                                                            index,
                                                            event.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-end justify-end">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeImageRow(index)
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addImageRow}
                                    >
                                        Add image
                                    </Button>

                                    {errors.images && (
                                        <p className="text-destructive text-sm">
                                            {normalizeError(errors.images)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center justify-between gap-3">
                            <Link
                                href={route('projects.index')}
                                className="text-muted-foreground hover:text-foreground text-sm"
                            >
                                Cancel
                            </Link>

                            <div className="flex items-center gap-3">
                                <Link
                                    href={route('projects.destroy', project.id)}
                                    method="delete"
                                    as="button"
                                    className="text-destructive text-sm hover:underline"
                                >
                                    Delete
                                </Link>

                                <Button type="submit" disabled={processing}>
                                    Save changes
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
