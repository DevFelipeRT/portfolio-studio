// resources/js/Pages/Initiatives/Partials/InitiativeForm.tsx

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { InitiativeFormData } from '@/modules/initiatives/core/forms';
import type { InitiativeImage } from '@/modules/initiatives/core/types';
import { Link } from '@inertiajs/react';
import React from 'react';
import { RichTextEditor } from '@/common/rich-text/RichTextEditor';

type InitiativeFormProps = {
    submitLabel: string;
    backRoute: string;
    existingImages: InitiativeImage[];
    data: InitiativeFormData;
    errors: Record<string, string | string[]>;
    processing: boolean;
    supportedLocales: readonly string[];
    localeDisabled?: boolean;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onChangeField: <K extends keyof InitiativeFormData>(
        key: K,
        value: InitiativeFormData[K],
    ) => void;
    onChangeLocale?: (locale: string) => void;
    onAddImageRow: () => void;
    onRemoveImageRow: (index: number) => void;
    onUpdateImageAlt: (index: number, value: string) => void;
    onUpdateImageFile: (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    normalizeError: (message: string | string[] | undefined) => string | null;
};

/**
 * Shared form for creating and editing initiatives.
 */
export function InitiativeForm({
    submitLabel,
    backRoute,
    existingImages,
    data,
    errors,
    processing,
    supportedLocales,
    localeDisabled = false,
    onSubmit,
    onChangeField,
    onChangeLocale,
    onAddImageRow,
    onRemoveImageRow,
    onUpdateImageAlt,
    onUpdateImageFile,
    normalizeError,
}: InitiativeFormProps) {
    const hasExistingImages = existingImages.length > 0;

    return (
        <form
            onSubmit={onSubmit}
            className="bg-card space-y-8 rounded-lg border p-6 shadow-sm"
        >
            <section className="space-y-4">
                <h2 className="text-lg font-medium">Basic information</h2>

                <div className="space-y-1.5">
                    <Label htmlFor="locale">Locale</Label>
                    <Select
                        value={data.locale}
                        onValueChange={(value) => {
                            if (onChangeLocale) {
                                onChangeLocale(value);
                                return;
                            }

                            onChangeField('locale', value);
                        }}
                        disabled={processing || localeDisabled}
                    >
                        <SelectTrigger id="locale">
                            <SelectValue placeholder="Select a locale" />
                        </SelectTrigger>
                        <SelectContent>
                            {supportedLocales.map((locale) => (
                                <SelectItem key={locale} value={locale}>
                                    {locale}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.locale && (
                        <p className="text-destructive text-sm">
                            {normalizeError(errors.locale)}
                        </p>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(event) =>
                                onChangeField('name', event.target.value)
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
                        onChange={(value) => onChangeField('start_date', value)}
                        placeholder="Select a date"
                        required
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="summary">Summary</Label>
                        <Input
                            id="summary"
                            value={data.summary}
                            onChange={(event) =>
                                onChangeField('summary', event.target.value)
                            }
                        />
                        {errors.summary && (
                            <p className="text-destructive text-sm">
                                {normalizeError(errors.summary)}
                            </p>
                        )}
                    </div>

                    <DatePicker
                        id="end_date"
                        label="End date (optional)"
                        value={data.end_date}
                        onChange={(value) => onChangeField('end_date', value)}
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
                    <Label htmlFor="description">Description</Label>
                    <RichTextEditor
                        id="description"
                        value={data.description}
                        onChange={(value) =>
                            onChangeField('description', value)
                        }
                    />
                    {errors.description && (
                        <p className="text-destructive text-sm">
                            {normalizeError(errors.description)}
                        </p>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="display"
                        checked={data.display}
                        onCheckedChange={(checked) => {
                            onChangeField('display', !!checked);
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

            {hasExistingImages && (
                <section className="space-y-4">
                    <h2 className="text-lg font-medium">Current images</h2>

                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {existingImages.map((image) => (
                            <figure
                                key={image.id}
                                className="bg-muted/40 overflow-hidden rounded-md border"
                            >
                                <img
                                    src={image.url ?? image.src ?? ''}
                                    alt={
                                        image.alt_text ??
                                        image.alt ??
                                        image.image_title ??
                                        image.title ??
                                        ''
                                    }
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
                                        onUpdateImageFile(index, event)
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
                                        onUpdateImageAlt(
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
                                    onClick={() => onRemoveImageRow(index)}
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
                        onClick={onAddImageRow}
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
