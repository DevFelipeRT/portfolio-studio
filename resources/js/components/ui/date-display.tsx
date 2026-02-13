'use client';

import { cn } from '@/lib/utils';
import { format as formatDate, isValid, parse, type Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';
import * as React from 'react';

// --- Internal Utilities ---

const FALLBACK_LOCALE_OBJ = enUS;

/**
 * List of parsing strategies, prioritizing ISO formats for robustness,
 * followed by common locale-sensitive formats (like PPP, PP, etc.).
 */
const PARSE_STRATEGIES = [
    'yyyy-MM-dd',
    'yyyy-MM-dd HH:mm:ss',
    'yyyy-MM-dd HH:mm',
    'P',
    'PP',
    'PPP',
    'Pp',
    'PPpp',
    'dd/MM/yyyy',
    'dd-MM-yyyy',
    'dd.MM.yyyy',
    'MM/dd/yyyy',
    'yyyy/MM/dd',
    'd MMM yyyy',
    'd MMMM yyyy',
];

/**
 * Normalizes a locale code by removing separators for robust comparison.
 */
function normalizeLocaleCode(code: string): string {
    return code.replace(/[-_]/g, '').toUpperCase();
}

/**
 * Hook for asynchronously loading a date-fns locale object based on the code.
 * Returns a stable reference to the currently loaded Locale object.
 */
function useDynamicDateFnsLocale(localeCode: string): Locale {
    const [loadedLocale, setLoadedLocale] =
        React.useState<Locale>(FALLBACK_LOCALE_OBJ);
    // Tracks the code of the last successfully loaded locale (crucial for stability).
    const [loadedCode, setLoadedCode] = React.useState<string>(
        FALLBACK_LOCALE_OBJ.code || 'en-US',
    );

    React.useEffect(() => {
        let isMounted = true;
        const codeToUse = localeCode || 'en-US';
        const currentNormalized = normalizeLocaleCode(loadedCode);
        const requestedNormalized = normalizeLocaleCode(codeToUse);

        // Skip operation if the requested locale is already loaded.
        if (requestedNormalized === currentNormalized) {
            return;
        }

        const loadLocale = async () => {
            // --- Synchronous Fallback Handling ---
            if (normalizeLocaleCode('EN').includes(requestedNormalized)) {
                if (
                    currentNormalized !==
                    normalizeLocaleCode(FALLBACK_LOCALE_OBJ.code || 'en-US')
                ) {
                    setLoadedLocale(FALLBACK_LOCALE_OBJ);
                    setLoadedCode(FALLBACK_LOCALE_OBJ.code || 'en-US');
                }
                return;
            }

            // --- Asynchronous Import for non-fallback locales ---
            let normalizedCode = codeToUse.replace(/[-_]/g, '');
            if (normalizedCode === 'en') normalizedCode = 'enUS';

            try {
                const localeModule = await import('date-fns/locale');
                let localeObj = (localeModule as any)[normalizedCode];

                // Case-insensitive fallback search within the module
                if (!localeObj) {
                    const keys = Object.keys(localeModule);
                    const matchingKey = keys.find(
                        (key) =>
                            key.toLowerCase() === normalizedCode.toLowerCase(),
                    );
                    if (matchingKey)
                        localeObj = (localeModule as any)[matchingKey];
                }

                if (isMounted && localeObj) {
                    // CRUCIAL: Force a new object reference to trigger useMemo in consuming components,
                    // which resolves the race condition by forcing a recalculation when the locale is ready.
                    setLoadedLocale({ ...localeObj });
                    setLoadedCode(codeToUse);
                }
            } catch (error) {
                if (isMounted) {
                    setLoadedLocale(FALLBACK_LOCALE_OBJ);
                    setLoadedCode(FALLBACK_LOCALE_OBJ.code || 'en-US');
                }
            }
        };

        loadLocale();
        return () => {
            isMounted = false;
        };
    }, [localeCode, loadedCode]); // `loadedCode` ensures the effect re-runs if the internal state changes

    return loadedLocale;
}

/**
 * Parses the input value (which may be ISO or a localized string) into a valid Date object,
 * using the provided locale for disambiguation.
 */
function parseToDate(
    input: string | number | Date | null | undefined,
    localeObj: Locale,
): Date | undefined {
    if (input === null || input === undefined) return undefined;
    if (input instanceof Date) return isValid(input) ? input : undefined;
    if (typeof input === 'number') {
        const date = new Date(input);
        return isValid(date) ? date : undefined;
    }
    if (typeof input === 'string') {
        if (!input.trim()) return undefined;

        // Attempt parsing using all strategies, passing the localeObj for localized strings.
        for (const formatStr of PARSE_STRATEGIES) {
            const parsed = parse(input, formatStr, new Date(), {
                locale: localeObj,
            });
            if (isValid(parsed)) return parsed;
        }

        // Final native fallback
        const nativeParsed = new Date(input);
        if (isValid(nativeParsed)) return nativeParsed;
    }
    return undefined;
}

// --- Component Definition ---

type DateInput = string | number | Date | null | undefined;

type DateDisplayProps<T extends React.ElementType = 'time'> = {
    /**
     * The input value to be parsed and displayed (ISO or localized string).
     */
    value: DateInput;
    /**
     * The date-fns format string for the output. Defaults to 'PPP'.
     */
    format?: string;
    /**
     * The locale identifier for formatting. Defaults to 'en-US'.
     */
    locale?: string;
    /**
     * Content to render when the date is invalid or null. Defaults to null.
     */
    fallback?: React.ReactNode;
    /**
     * The HTML element used for the root node. Defaults to 'time'.
     */
    as?: T;
} & React.ComponentPropsWithoutRef<T>;

/**
 * Renders a formatted date string within a semantic HTML element.
 */
export function DateDisplay<T extends React.ElementType = 'time'>({
    value,
    format = 'PPP',
    locale = 'en-US',
    fallback = null,
    as,
    className,
    ...props
}: DateDisplayProps<T>) {
    const Component = as || 'time';

    // Load locale object (hook only executes if locale prop changes)
    const activeLocaleObj = useDynamicDateFnsLocale(locale);

    // Parse the input value. Memoization depends on value and the active locale object.
    // This ensures that parsing is re-attempted immediately after a new locale is loaded.
    const dateObject = React.useMemo(
        () => parseToDate(value, activeLocaleObj),
        [value, activeLocaleObj],
    );

    if (!dateObject) {
        return fallback ? <>{fallback}</> : null;
    }

    // Format the date for display
    const formattedDate = formatDate(dateObject, format, {
        locale: activeLocaleObj,
    });
    // Format to ISO string for semantic HTML attribute
    const isoString = dateObject.toISOString();

    return (
        <Component
            dateTime={isoString}
            className={cn('whitespace-nowrap', className)}
            {...props}
        >
            {formattedDate}
        </Component>
    );
}
