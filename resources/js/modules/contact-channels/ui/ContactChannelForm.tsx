import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useSupportedLocales } from '@/common/i18n';
import {
    FormField,
    FormErrorSummary,
    collectErroredFieldLabels,
    type FormErrors,
} from '@/common/forms';
import type {
    ContactChannelFormData,
} from '@/modules/contact-channels/core/forms';
import type {
    ContactChannelTypeOption,
} from '@/modules/contact-channels/core/types';
import { Link } from '@inertiajs/react';
import React, { JSX } from 'react';

type ContactChannelFormAlignment = 'right' | 'split';

interface ContactChannelFormProps {
    data: ContactChannelFormData;
    errors: FormErrors<keyof ContactChannelFormData>;
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
    const summaryFields = collectErroredFieldLabels(errors, [
        { name: 'locale', label: 'Locale' },
        { name: 'channel_type', label: 'Type' },
        { name: 'label', label: 'Label' },
        { name: 'value', label: 'Value' },
        { name: 'sort_order', label: 'Order' },
        { name: 'is_active', label: 'Active' },
    ] as const);

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
            <FormErrorSummary fields={summaryFields} />

            <FormField
                name="locale"
                errors={errors}
                htmlFor="locale"
                label="Locale"
                required
            >
                {({ a11yAttributes, getSelectClassName }) => (
                    <Select
                        value={data.locale}
                        onValueChange={(value) => onChange('locale', value)}
                        disabled={processing}
                    >
                        <SelectTrigger
                            id="locale"
                            className={getSelectClassName()}
                            {...a11yAttributes}
                        >
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
                )}
            </FormField>

            <FormField
                name="channel_type"
                errors={errors}
                htmlFor="channel-type"
                label="Type"
                required
                errorId="channel-type-error"
            >
                {({ a11yAttributes, getSelectClassName }) => (
                    <Select
                        value={data.channel_type}
                        onValueChange={(value) => onChange('channel_type', value)}
                    >
                        <SelectTrigger
                            id="channel-type"
                            className={getSelectClassName()}
                            {...a11yAttributes}
                        >
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
                )}
            </FormField>

            <FormField
                name="label"
                errors={errors}
                htmlFor="label"
                label="Label"
            >
                {({ a11yAttributes, getInputClassName }) => (
                    <Input
                        id="label"
                        value={data.label}
                        onChange={(event) => onChange('label', event.target.value)}
                        placeholder="Optional label"
                        className={getInputClassName()}
                        {...a11yAttributes}
                    />
                )}
            </FormField>

            <FormField
                name="value"
                errors={errors}
                htmlFor="value"
                label="Value"
                required
            >
                {({ a11yAttributes, getInputClassName }) => (
                    <Input
                        id="value"
                        value={data.value}
                        onChange={(event) => onChange('value', event.target.value)}
                        placeholder="Email, phone number, handle, or URL"
                        className={getInputClassName()}
                        {...a11yAttributes}
                    />
                )}
            </FormField>

            <div className="grid gap-4 md:grid-cols-2">
                <FormField
                    name="sort_order"
                    errors={errors}
                    htmlFor="sort-order"
                    label="Order"
                    errorId="sort-order-error"
                >
                    {({ a11yAttributes, getInputClassName }) => (
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
                            className={getInputClassName()}
                            {...a11yAttributes}
                        />
                    )}
                </FormField>

                <FormField
                    name="is_active"
                    errors={errors}
                    htmlFor="is-active"
                    label="Active"
                    variant="inline"
                    className="pt-6"
                >
                    {({ a11yAttributes }) => (
                        <Checkbox
                            id="is-active"
                            checked={data.is_active}
                            onCheckedChange={(checked) =>
                                onChange('is_active', Boolean(checked))
                            }
                            {...a11yAttributes}
                        />
                    )}
                </FormField>
            </div>

            {alignActions === 'split' ? renderActionsSplit() : renderActionsRight()}
        </form>
    );
}
