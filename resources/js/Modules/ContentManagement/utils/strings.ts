import { StringNormalizer } from "../types/strings";
import { normalizeString } from "./typeNormalizers";

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
