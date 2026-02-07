import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import type { Initiative } from '@/Modules/Initiatives/core/types';
import { InitiativeForm } from '@/Modules/Initiatives/ui/InitiativeForm';
import type {
    InitiativeFormData,
    InitiativeImageInput,
} from '@/Modules/Initiatives/core/forms';
import { useSupportedLocales } from '@/Common/i18n';
import React from 'react';
import { Button } from '@/Components/Ui/button';
import { TranslationModal } from '@/Modules/Initiatives/ui/TranslationModal';
import { listInitiativeTranslations } from '@/Modules/Initiatives/core/api/translations';
import { LocaleSwapDialog } from '@/Common/LocaleSwapDialog';

interface EditInitiativeProps {
    initiative: Initiative;
}

export default function Edit({ initiative }: EditInitiativeProps) {
    const supportedLocales = useSupportedLocales();

    const { data, setData, post, processing, errors, transform } =
        useForm<InitiativeFormData>({
            locale: initiative.locale,
            confirm_swap: false,
            name: initiative.name,
            summary: initiative.summary ?? '',
            description: initiative.description ?? '',
            display: initiative.display,
            start_date: initiative.start_date,
            end_date: initiative.end_date ?? null,
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
                return {
                    ...rest,
                    _method: 'put',
                } as unknown as InitiativeFormData;
            }

            return {
                ...current,
                images: validImages,
                _method: 'put',
            } as unknown as InitiativeFormData;
        });

        post(route('initiatives.update', initiative.id), {
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

    const [translationOpen, setTranslationOpen] = React.useState(false);
    const [swapDialogOpen, setSwapDialogOpen] = React.useState(false);
    const [pendingLocale, setPendingLocale] = React.useState<string | null>(null);
    const [translationLocales, setTranslationLocales] = React.useState<string[]>(
        [],
    );
    const [loadingTranslations, setLoadingTranslations] = React.useState(false);
    const [localesLoadError, setLocalesLoadError] = React.useState<string | null>(
        null,
    );

    React.useEffect(() => {
        let mounted = true;

        const loadTranslations = async (): Promise<void> => {
            setLoadingTranslations(true);
            setLocalesLoadError(null);
            try {
                const items = await listInitiativeTranslations(initiative.id);
                if (mounted) {
                    setTranslationLocales(
                        items.map((item) => item.locale).filter(Boolean),
                    );
                }
            } catch (err) {
                if (mounted) {
                    setLocalesLoadError(
                        'Unable to load translations for locale conflict checks.',
                    );
                }
            } finally {
                if (mounted) {
                    setLoadingTranslations(false);
                }
            }
        };

        void loadTranslations();

        return () => {
            mounted = false;
        };
    }, [initiative.id]);

    const handleLocaleChange = (nextLocale: string): void => {
        if (
            nextLocale !== data.locale &&
            translationLocales.includes(nextLocale)
        ) {
            setPendingLocale(nextLocale);
            setSwapDialogOpen(true);
            return;
        }

        setData('confirm_swap', false);
        setData('locale', nextLocale);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit initiative" />

            <div className="overflow-hidden">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <Link
                            href={route('initiatives.index')}
                            className="text-muted-foreground hover:text-foreground text-sm"
                        >
                            Back to initiatives
                        </Link>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setTranslationOpen(true)}
                        >
                            Manage translations
                        </Button>
                    </div>

                    <InitiativeForm
                        submitLabel="Save changes"
                        backRoute={route('initiatives.index')}
                        existingImages={initiative.images ?? []}
                        data={data}
                        errors={errors}
                        processing={processing}
                        supportedLocales={supportedLocales}
                        localeDisabled={
                            loadingTranslations || Boolean(localesLoadError)
                        }
                        onSubmit={submit}
                        onChangeField={changeField}
                        onChangeLocale={handleLocaleChange}
                        onAddImageRow={addImageRow}
                        onRemoveImageRow={removeImageRow}
                        onUpdateImageAlt={updateImageAlt}
                        onUpdateImageFile={updateImageFile}
                        normalizeError={normalizeError}
                    />

                    {localesLoadError && (
                        <p className="text-muted-foreground mt-3 text-xs">
                            {localesLoadError}
                        </p>
                    )}
                </div>
            </div>

            <TranslationModal
                open={translationOpen}
                onClose={() => setTranslationOpen(false)}
                initiativeId={initiative.id}
                initiativeLabel={initiative.name}
                baseLocale={data.locale}
            />

            {pendingLocale && (
                <LocaleSwapDialog
                    open={swapDialogOpen}
                    currentLocale={data.locale}
                    nextLocale={pendingLocale}
                    onConfirmSwap={() => {
                        setData('confirm_swap', true);
                        setData('locale', pendingLocale);
                        setSwapDialogOpen(false);
                        setPendingLocale(null);
                    }}
                    onConfirmNoSwap={() => {
                        setData('confirm_swap', false);
                        setData('locale', pendingLocale);
                        setSwapDialogOpen(false);
                        setPendingLocale(null);
                    }}
                    onCancel={() => {
                        setSwapDialogOpen(false);
                        setPendingLocale(null);
                    }}
                />
            )}
        </AuthenticatedLayout>
    );
}
