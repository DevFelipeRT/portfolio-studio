export function parseOptionalInteger(raw: string): number | null {
    const trimmed = raw.trim();

    if (trimmed === '') {
        return null;
    }

    const parsed = Number.parseInt(trimmed, 10);

    if (Number.isNaN(parsed)) {
        return null;
    }

    return parsed;
}

export function parsePositiveIntegerStrict(
    raw: string,
): number | null | undefined {
    const trimmed = raw.trim();

    if (trimmed === '') {
        return null;
    }

    if (!/^\d+$/.test(trimmed)) {
        return undefined;
    }

    const parsed = Number.parseInt(trimmed, 10);

    if (Number.isNaN(parsed) || parsed < 1) {
        return undefined;
    }

    return parsed;
}

export function parseCommaSeparatedIntegers(raw: string): number[] {
    const trimmed = raw.trim();

    if (trimmed === '') {
        return [];
    }

    const parts = trimmed
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part !== '');

    return parts
        .map((part) => Number.parseInt(part, 10))
        .filter((item) => !Number.isNaN(item));
}

export function parseCommaSeparatedPositiveIntegers(raw: string): number[] {
    const trimmed = raw.trim();

    if (trimmed === '') {
        return [];
    }

    const parts = trimmed
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part !== '');

    const ids: number[] = [];

    for (const part of parts) {
        if (!/^\d+$/.test(part)) {
            continue;
        }

        const parsed = Number.parseInt(part, 10);

        if (Number.isNaN(parsed) || parsed < 1) {
            continue;
        }

        ids.push(parsed);
    }

    return ids;
}
