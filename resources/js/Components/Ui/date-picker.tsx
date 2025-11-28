// resources/js/Components/Ui/date-picker.tsx
'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/Components/Ui/button';
import { Calendar } from '@/Components/Ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/Ui/popover';
import { Label } from '@/Components/Ui/label';

type SingleDatePickerProps = {
    id: string;
    label: string;
    value: string | null;
    onChange(value: string | null): void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
};

/**
 * Parses a storage string (YYYY-MM-DD) into a Date instance.
 */
function parseStorageDate(value: string | null | undefined): Date | undefined {
    if (!value) {
        return undefined;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return undefined;
    }

    return parsed;
}

/**
 * Formats a Date instance as YYYY-MM-DD for storage.
 */
function formatStorageDate(date: Date | undefined): string | null {
    if (!date) {
        return null;
    }

    return format(date, 'yyyy-MM-dd');
}

/**
 * Formats a Date instance for UI display (localized).
 */
function formatDisplayDate(date: Date | undefined): string {
    if (!date) {
        return '';
    }

    return format(date, 'PPP');
}

/**
 * SingleDatePicker renders a labeled date picker backed by a single date value.
 *
 * External value: string | null (YYYY-MM-DD)
 * Internal value: Date
 */
export function SingleDatePicker({
    id,
    label,
    value,
    onChange,
    placeholder = 'Select date',
    disabled = false,
    required = false,
    className,
}: SingleDatePickerProps) {
    const [open, setOpen] = React.useState(false);

    const selectedDate = React.useMemo(
        () => parseStorageDate(value),
        [value],
    );

    function handleSelect(date: Date | undefined): void {
        const next = formatStorageDate(date);
        onChange(next);
        setOpen(false);
    }

    const displayLabel =
        selectedDate !== undefined
            ? formatDisplayDate(selectedDate)
            : placeholder;

    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={id}>
                {label}
                {required && (
                    <span className="text-destructive ml-0.5">*</span>
                )}
            </Label>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        data-empty={!selectedDate}
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !selectedDate && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{displayLabel}</span>
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-auto p-0"
                    align="start"
                >
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        initialFocus
                        className="rounded-md border bg-popover shadow-md"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
