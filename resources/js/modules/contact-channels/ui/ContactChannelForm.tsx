import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useSupportedLocales } from '@/common/i18n';
import type {
    ContactChannelFormData,
} from '@/modules/contact-channels/core/forms';
import type {
    ContactChannelTypeOption,
} from '@/modules/contact-channels/core/types';
import { Link } from '@inertiajs/react';
import React, { JSX } from 'react';

type ContactChannelFormErrors = Record<string, string | string[] | undefined>;

type ContactChannelFormAlignment = 'right' | 'split';

interface ContactChannelFormProps {
    data: ContactChannelFormData;
    errors: ContactChannelFormErrors;
    channelTypes: ContactChannelTypeOption[];
    processing: boolean;
    onChange(field: keyof ContactChannelFormData, value: string | number | boolean | ''): void;
    onSubmit(event: React.FormEvent<HTMLFormElement>): void;
    cancelHref: string;
    submitLabel: string;
    deleteHref?: string;
    deleteLabel?: string;
    alignActions?: ContactChannelFormAlignment;
}

export function ContactChannelForm({
    data,
    errors,
    channelTypes,
    processing,
    onChange,
    onSubmit,
    cancelHref,
    submitLabel,
    deleteHref,
    deleteLabel = 'Delete',
    alignActions = 'right',
}: ContactChannelFormProps) {
    const supportedLocales = useSupportedLocales();

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

    const renderActionsRight = (): JSX.Element => (
        <div className="flex items-center justify-end gap-3">
            <Link
                href={cancelHref}
                className="text-muted-foreground hover:text-foreground text-sm"
            >
                Cancel
            </Link>

            <Button type="submit" disabled={processing}>
                {submitLabel}
            </Button>
        </div>
    );

    const renderActionsSplit = (): JSX.Element => (
        <div className="flex items-center justify-between gap-3">
            <Link
                href={cancelHref}
                className="text-muted-foreground hover:text-foreground text-sm"
            >
                Cancel
            </Link>

            <div className="flex items-center gap-3">
                {deleteHref && (
                    <Link
                        href={deleteHref}
                        method="delete"
                        as="button"
                        className="text-destructive text-sm hover:underline"
                    >
                        {deleteLabel}
                    </Link>
                )}

                <Button type="submit" disabled={processing}>
                    {submitLabel}
                </Button>
            </div>
        </div>
    );

    return (
        <form
            onSubmit={onSubmit}
            className="bg-card space-y-6 rounded-lg border p-6 shadow-sm"
        >
            <div className="space-y-1.5">
                <Label htmlFor="locale">Locale</Label>
                <Select
                    value={data.locale}
                    onValueChange={(value) => onChange('locale', value)}
                    disabled={processing}
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
                        {normalizeError(errors.locale as string | string[])}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="channel-type">Type</Label>
                <Select
                    value={data.channel_type}
                    onValueChange={(value) => onChange('channel_type', value)}
                >
                    <SelectTrigger id="channel-type">
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>

                    <SelectContent>
                        {channelTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.channel_type && (
                    <p className="text-destructive text-sm">
                        {normalizeError(errors.channel_type as string | string[])}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="label">Label</Label>
                <Input
                    id="label"
                    value={data.label}
                    onChange={(event) => onChange('label', event.target.value)}
                    placeholder="Optional label"
                />
                {errors.label && (
                    <p className="text-destructive text-sm">
                        {normalizeError(errors.label as string | string[])}
                    </p>
                )}
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="value">Value</Label>
                <Input
                    id="value"
                    value={data.value}
                    onChange={(event) => onChange('value', event.target.value)}
                    placeholder="Email, phone number, handle, or URL"
                />
                {errors.value && (
                    <p className="text-destructive text-sm">
                        {normalizeError(errors.value as string | string[])}
                    </p>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                    <Label htmlFor="sort-order">Order</Label>
                    <Input
                        id="sort-order"
                        type="number"
                        min={0}
                        value={data.sort_order}
                        onChange={(event) =>
                            onChange(
                                'sort_order',
                                event.target.value === ''
                                    ? ''
                                    : Number(event.target.value),
                            )
                        }
                    />
                    {errors.sort_order && (
                        <p className="text-destructive text-sm">
                            {normalizeError(errors.sort_order as string | string[])}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3 pt-6">
                    <Checkbox
                        id="is-active"
                        checked={data.is_active}
                        onCheckedChange={(checked) =>
                            onChange('is_active', Boolean(checked))
                        }
                    />
                    <Label htmlFor="is-active">Active</Label>
                </div>
            </div>

            {alignActions === 'split' ? renderActionsSplit() : renderActionsRight()}
        </form>
    );
}
