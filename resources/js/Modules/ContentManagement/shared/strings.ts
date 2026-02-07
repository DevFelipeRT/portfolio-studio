import type { StringNormalizer } from '@/Modules/ContentManagement/features/page-rendering';

export function normalizeString(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : null;
}

export function normalizeSlotKey(
    value: string | null | undefined,
): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmed = value.trim().toLowerCase();

    return trimmed.length > 0 ? trimmed : null;
}

export const defaultStringNormalizer: StringNormalizer = {
    normalize: normalizeString,
    normalizeSlotKey,
};
