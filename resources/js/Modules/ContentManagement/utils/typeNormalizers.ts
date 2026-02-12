export function normalizeBoolean(
    value: unknown,
    fallback = false,
): boolean {
    return typeof value === 'boolean' ? value : fallback;
}

export function normalizeInteger(value: unknown): number | null {
    return typeof value === 'number' && Number.isInteger(value) ? value : null;
}

export function normalizeNumber(value: unknown): number | null {
    return typeof value === 'number' ? value : null;
}

export function normalizeNumberArray(value: unknown): number[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'number')
        ? [...value]
        : [];
}

export function coalesceNullable<T>(
    value: T | null | undefined,
    fallback: T,
): T {
    return value ?? fallback;
}

export function normalizeString(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : null;
}