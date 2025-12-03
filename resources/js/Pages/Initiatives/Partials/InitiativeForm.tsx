// resources/js/Pages/Initiatives/Partials/InitiativeForm.tsx

import { Button } from '@/Components/Ui/button';
import { Checkbox } from '@/Components/Ui/checkbox';
import { DatePicker } from '@/Components/Ui/date-picker';
import { Input } from '@/Components/Ui/input';
import { Label } from '@/Components/Ui/label';
import { Textarea } from '@/Components/Ui/textarea';
import { Link, useForm } from '@inertiajs/react';
import React from 'react';

type ImageInput = {
    file: File | null;
    alt?: string | null;
};

type InitiativeFormData = {
    name: string;
    short_description: string;
    long_description: string;
    display: boolean;
    start_date: string | null;
    end_date: string | null;
    images: ImageInput[];
};

type ExistingImage = {
    id: number;
    src: string;
    alt: string | null;
};

type InitiativeFormProps = {
    mode: 'create' | 'edit';
    submitRoute: string;
    backRoute: string;
    existingImages?: ExistingImage[];
    initialValues?: Partial<Omit<InitiativeFormData, 'images'>>;
};

/**
 * Shared form for creating and editing initiatives.
 */
export function InitiativeForm({
    mode,
    submitRoute,
    backRoute,
    existingImages,
    initialValues,
}: InitiativeFormProps) {
    const defaultValues: InitiativeFormData = {
        name: '',
        short_description: '',
        long_description: '',
        display: false,
        start_date: null,
        end_date: null,
        images: [],
    };

    const initial: InitiativeFormData = {
        ...defaultValues,
        ...initialValues,
        images: [],
    };

    const { data, setData, post, put, processing, errors, transform } =
        useForm<InitiativeFormData>(initial);

    const addImageRow = (): void => {
        setData((current: InitiativeFormData) => ({
            ...current,
            images: [
                ...current.images,
                {
                    file: null,
                    alt: '',
                },
            ],
        }));
    };

    const removeImageRow = (index: number): void => {
        setData((current: InitiativeFormData) => ({
            ...current,
            images: current.images.filter((_, i: number) => i !== index),
        }));
    };

    const updateImageAlt = (index: number, value: string): void => {
        setData((current: InitiativeFormData) => ({
            ...current,
            images: current.images.map((image: ImageInput, i: number) =>
                i === index ? { ...image, alt: value } : image,
            ),
        }));
    };

    const updateImageFile = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const file = event.target.files?.[0] ?? null;

        setData((current: InitiativeFormData) => ({
            ...current,
            images: current.images.map((image: ImageInput, i: number) =>
                i === index ? { ...image, file } : image,
            ),
        }));
    };

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

    const submit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        transform((current: InitiativeFormData) => {
            const validImages =
                current.images?.filter((image) => image.file instanceof File) ??
                [];

            if (validImages.length === 0) {
                const { images, ...rest } = current;
                return rest as unknown as InitiativeFormData;
            }

            return {
                ...current,
                images: validImages,
            };
        });

        if (mode === 'create') {
            post(submitRoute, {
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            put(submitRoute, {
                forceFormData: true,
                preserveScroll: true,
            });
        }
    };

    const submitLabel =
        mode === 'create' ? 'Save initiative' : 'Update initiative';

    return (
        <form
            onSubmit={submit}
            className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
        >
            <section className="space-y-4">
                <h2 className="text-lg font-medium">Basic information</h2>

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

                    <DatePicker
                        id="start_date"
                        label="Date or start date"
                        value={data.start_date}
                        onChange={(value) => setData('start_date', value)}
                        placeholder="Select a date"
                        required
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="short_description">
                            Short description
                        </Label>
                        <Input
                            id="short_description"
                            value={data.short_description}
                            onChange={(event) =>
                                setData('short_description', event.target.value)
                            }
                        />
                        {errors.short_description && (
                            <p className="text-destructive text-sm">
                                {normalizeError(errors.short_description)}
                            </p>
                        )}
                    </div>

                    <DatePicker
                        id="end_date"
                        label="End date (optional)"
                        value={data.end_date}
                        onChange={(value) => setData('end_date', value)}
                        placeholder="Select an end date"
                    />
                </div>

                {errors.start_date && (
                    <p className="text-destructive text-sm">
                        {normalizeError(errors.start_date)}
                    </p>
                )}

                {errors.end_date && (
                    <p className="text-destructive text-sm">
                        {normalizeError(errors.end_date)}
                    </p>
                )}

                <div className="space-y-1.5">
                    <Label htmlFor="long_description">Long description</Label>
                    <Textarea
                        id="long_description"
                        value={data.long_description}
                        onChange={(event) =>
                            setData('long_description', event.target.value)
                        }
                        rows={6}
                    />
                    {errors.long_description && (
                        <p className="text-destructive text-sm">
                            {normalizeError(errors.long_description)}
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

            {mode === 'edit' && existingImages && existingImages.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-lg font-medium">Current images</h2>

                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {existingImages.map((image) => (
                            <figure
                                key={image.id}
                                className="bg-muted/40 overflow-hidden rounded-md border"
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt ?? ''}
                                    className="h-32 w-full object-cover sm:h-36 md:h-40"
                                />
                            </figure>
                        ))}
                    </div>
                </section>
            )}

            <section className="space-y-4">
                <h2 className="text-lg font-medium">Images</h2>

                <div className="space-y-3">
                    {data.images.length === 0 && (
                        <p className="text-muted-foreground text-sm">
                            No images added yet.
                        </p>
                    )}

                    {data.images.map((image, index) => (
                        <div
                            key={index}
                            className="bg-background grid gap-3 rounded-md border p-3 md:grid-cols-[2fr,2fr,auto]"
                        >
                            <div className="space-y-1.5">
                                <Label htmlFor={`image-file-${index}`}>
                                    Image file
                                </Label>
                                <Input
                                    id={`image-file-${index}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) =>
                                        updateImageFile(index, event)
                                    }
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor={`image-alt-${index}`}>
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
                                    onClick={() => removeImageRow(index)}
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
            </section>

            <div className="flex items-center justify-end gap-3">
                <Link
                    href={backRoute}
                    className="text-muted-foreground hover:text-foreground text-sm"
                >
                    Cancel
                </Link>

                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
