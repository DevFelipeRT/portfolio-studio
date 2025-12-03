'use client';

import { Button } from '@/Components/Ui/button';
import { Calendar } from '@/Components/Ui/calendar';
import { Label } from '@/Components/Ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/Ui/popover';
import { cn } from '@/lib/utils';
import { format, isValid, parse, type Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import * as React from 'react';

const FALLBACK_LOCALE_OBJ = enUS;
const FALLBACK_LOCALE_CODE = 'en-US';
const ISO_FORMAT = 'yyyy-MM-dd';

/**
 * Normalizes a locale code by removing separators and converting to uppercase.
 */
function normalizeLocaleCode(code: string): string {
    return code.replace(/[-_]/g, '').toUpperCase();
}

/**
 * Loads a date-fns locale object asynchronously based on the provided code.
 * This hook is responsible for managing the asynchronous import and ensuring
 * the correct Locale object is available for display and calendar rendering.
 *
 * @returns {Locale} The loaded locale object.
 */
function useDynamicDateFnsLocale(
    localeCode: string,
    supportedLocales?: readonly string[],
): Locale {
    const codeToUse = localeCode || FALLBACK_LOCALE_CODE;

    const [localeObj, setLocaleObj] =
        React.useState<Locale>(FALLBACK_LOCALE_OBJ);
    const [loadedCode, setLoadedCode] =
        React.useState<string>(FALLBACK_LOCALE_CODE);

    React.useEffect(() => {
        let isMounted = true;

        const requestedNormalized = normalizeLocaleCode(codeToUse);
        const loadedNormalized = normalizeLocaleCode(loadedCode);

        // Skip operation if the requested locale is already loaded.
        if (requestedNormalized === loadedNormalized) {
            return;
        }

        const loadLocale = async () => {
            // Synchronous fallback handling for 'en' variants
            if (normalizeLocaleCode('EN').includes(requestedNormalized)) {
                if (
                    loadedNormalized !==
                    normalizeLocaleCode(FALLBACK_LOCALE_CODE)
                ) {
                    setLocaleObj(FALLBACK_LOCALE_OBJ);
                    setLoadedCode(FALLBACK_LOCALE_CODE);
                }
                return;
            }

            // --- Asynchronous Import for non-fallback locales (e.g., pt_BR) ---
            if (supportedLocales && !supportedLocales.includes(codeToUse)) {
                if (isMounted) {
                    setLocaleObj(FALLBACK_LOCALE_OBJ);
                    setLoadedCode(FALLBACK_LOCALE_CODE);
                }
                return;
            }

            let importCode = codeToUse.replace(/[-_]/g, '');
            if (importCode.toLowerCase() === 'en') importCode = 'enUS';

            try {
                const localeModule = await import('date-fns/locale');
                let localeObj = (localeModule as any)[importCode];

                if (!localeObj) {
                    const keys = Object.keys(localeModule);
                    const matchingKey = keys.find(
                        (key) => key.toLowerCase() === importCode.toLowerCase(),
                    );
                    if (matchingKey)
                        localeObj = (localeModule as any)[matchingKey];
                }

                if (isMounted && localeObj) {
                    // Critical: Force a new object reference to trigger useMemo/re-render in consuming components.
                    setLocaleObj({ ...localeObj });
                    setLoadedCode(codeToUse);
                }
            } catch (error) {
                if (isMounted) {
                    setLocaleObj(FALLBACK_LOCALE_OBJ);
                    setLoadedCode(FALLBACK_LOCALE_CODE);
                }
            }
        };

        loadLocale();
        return () => {
            isMounted = false;
        };
    }, [codeToUse, supportedLocales, loadedCode]);

    return localeObj;
}

/**
 * Parses the ISO input string (yyyy-MM-dd) into a valid Date object.
 * ASSUMPTION: Input 'value' is always in ISO format for stable parsing.
 */
function parseIsoToDate(input: string | null | undefined): Date | undefined {
    if (!input) return undefined;

    // Parsing is done using the locale-agnostic ISO_FORMAT.
    const parsed = parse(input, ISO_FORMAT, new Date());
    if (isValid(parsed)) return parsed;

    // Fallback to native parsing
    const nativeParsed = new Date(input);
    return isValid(nativeParsed) ? nativeParsed : undefined;
}

type DatePickerProps = {
    id: string;
    value: string | null;
    onChange(value: string | null): void;
    /**
     * A whitelist of allowed locale codes.
     */
    supportedLocales?: readonly string[];
    /**
     * The locale identifier for parsing and calendar rendering.
     */
    locale?: string;
    /**
     * The date-fns format string for the trigger button display.
     */
    displayFormat?: string;
    /**
     * Properties forwarded to the internal Calendar component.
     */
    calendarProps?: Partial<
        Omit<
            React.ComponentProps<typeof Calendar>,
            'mode' | 'selected' | 'onSelect'
        >
    >;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
};

/**
 * Renders a date input triggered via a popover calendar.
 * Expects the 'value' prop to be in ISO format (yyyy-MM-dd) or null.
 */
export function DatePicker({
    id,
    value,
    onChange,
    supportedLocales,
    locale = 'en-US',
    displayFormat = 'PPP',
    calendarProps,
    label = 'Date',
    placeholder = 'Select date',
    disabled = false,
    required = false,
    className,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    // Load locale object for formatting display and calendar
    const localeObj = useDynamicDateFnsLocale(locale, supportedLocales);

    // Parsing relies only on the value (ISO) for maximum stability.
    const selectedDate = React.useMemo(() => parseIsoToDate(value), [value]);

    // Format display label using the loaded locale
    const displayLabel = selectedDate
        ? format(selectedDate, displayFormat, { locale: localeObj })
        : placeholder;

    const handleSelect = (date: Date | undefined): void => {
        // Always store date in locale-agnostic ISO format
        onChange(date ? format(date, ISO_FORMAT) : null);
        setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
    };

    return (
        <div className={cn('space-y-1.5', className)}>
            <Label htmlFor={id}>
                {label}
                {required && <span className="text-destructive ml-0.5">*</span>}
            </Label>

            <div className="relative">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id={id}
                            type="button"
                            variant="outline"
                            disabled={disabled}
                            data-empty={!selectedDate}
                            aria-label={
                                selectedDate
                                    ? `Selected date: ${displayLabel}`
                                    : 'Select date'
                            }
                            className={cn(
                                'w-full justify-start bg-transparent text-left font-normal',
                                !selectedDate && 'text-muted-foreground',
                                selectedDate && !disabled && 'pr-9',
                            )}
                        >
                            <CalendarIcon
                                className="mr-2 h-4 w-4"
                                aria-hidden="true"
                            />
                            <span className="truncate">{displayLabel}</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleSelect}
                            locale={localeObj}
                            className="bg-popover rounded-md border shadow-md"
                            classNames={{
                                caption_label: 'text-sm font-medium capitalize',
                            }}
                            {...calendarProps}
                        />
                    </PopoverContent>
                </Popover>

                {selectedDate && !disabled && (
                    <div className="absolute top-0 right-0 flex h-full items-center pr-2">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-muted-foreground hover:text-foreground rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
                            aria-label="Clear date"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
