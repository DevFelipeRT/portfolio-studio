export interface StringNormalizer {
    normalize: (value: unknown) => string | null;
    normalizeSlotKey: (value: string | null | undefined) => string | null;
}
