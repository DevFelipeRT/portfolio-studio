import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { InitiativeForm } from '@/Modules/Initiatives/ui/InitiativeForm';
import type {
    InitiativeFormData,
    InitiativeImageInput,
} from '@/Modules/Initiatives/core/forms';
import { useSupportedLocales } from '@/Common/i18n';
import React from 'react';

export default function Create() {
    const supportedLocales = useSupportedLocales();
    const { data, setData, post, processing, errors, transform } =
        useForm<InitiativeFormData>({
            locale: '',
            name: '',
            summary: '',
            description: '',
            display: false,
            start_date: null,
            end_date: null,
            images: [],
        });

    function changeField<K extends keyof InitiativeFormData>(
        key: K,
        value: InitiativeFormData[K],
    ): void {
        setData((current: InitiativeFormData) => ({
            ...current,
            [key]: value,
        }));
    }

    function addImageRow(): void {
        setData((current: InitiativeFormData) => ({
            ...current,
            images: [
                ...current.images,
                {
                    file: null,
                    alt: '',
                } as InitiativeImageInput,
            ],
        }));
    }

    function removeImageRow(index: number): void {
        setData((current: InitiativeFormData) => ({
            ...current,
            images: current.images.filter((_image, i) => i !== index),
        }));
    }

    function updateImageAlt(index: number, value: string): void {
        setData((current: InitiativeFormData) => ({
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

        setData((current: InitiativeFormData) => ({
            ...current,
            images: current.images.map((image, i) =>
                i === index ? { ...image, file } : image,
            ),
        }));
    }

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

        post(route('initiatives.store'), {
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
        <AuthenticatedLayout>
            <Head title="New initiative" />

            <div className="overflow-hidden">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('initiatives.index')}
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Back to initiatives
                        </Link>
                    </div>

                    <InitiativeForm
                        submitLabel="Save initiative"
                        backRoute={route('initiatives.index')}
                        existingImages={[]}
                        data={data}
                        errors={errors}
                        processing={processing}
                        supportedLocales={supportedLocales}
                        onSubmit={submit}
                        onChangeField={changeField}
                        onAddImageRow={addImageRow}
                        onRemoveImageRow={removeImageRow}
                        onUpdateImageAlt={updateImageAlt}
                        onUpdateImageFile={updateImageFile}
                        normalizeError={normalizeError}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
