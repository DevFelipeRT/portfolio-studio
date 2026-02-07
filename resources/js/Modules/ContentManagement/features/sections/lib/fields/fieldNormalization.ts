import type {
    SectionDataValue,
    TemplateFieldPrimitiveType,
} from '@/Modules/ContentManagement/types';

function normalizeStringLike(value: SectionDataValue): string | undefined {
    if (value == null) {
        return undefined;
    }

    let asString: string;

    if (Array.isArray(value)) {
        asString = String(value.join(','));
    } else if (typeof value === 'object') {
        asString = JSON.stringify(value);
    } else {
        asString = String(value);
    }

    const trimmed = asString.trim();

    if (trimmed === '') {
        return undefined;
    }

    return trimmed;
}

export function normalizeValue(
    value: SectionDataValue,
    primitiveType?: TemplateFieldPrimitiveType,
): SectionDataValue | undefined {
    if (primitiveType === undefined) {
        return value;
    }

    switch (primitiveType) {
        case 'string':
        case 'text':
        case 'rich_text': {
            return normalizeStringLike(value);
        }

        case 'integer': {
            if (value == null) {
                return undefined;
            }

            if (typeof value === 'number') {
                return Number.isFinite(value) ? value : undefined;
            }

            if (typeof value === 'string') {
                const trimmed = value.trim();

                if (trimmed === '') {
                    return undefined;
                }

                const parsed = Number.parseInt(trimmed, 10);
                return Number.isNaN(parsed) ? undefined : parsed;
            }

            return undefined;
        }

        case 'boolean': {
            if (typeof value === 'boolean') {
                return value;
            }

            if (typeof value === 'string') {
                const trimmed = value.trim().toLowerCase();

                if (trimmed === '') {
                    return undefined;
                }

                if (trimmed === 'true') {
                    return true;
                }

                if (trimmed === 'false') {
                    return false;
                }
            }

            return undefined;
        }

        case 'array_integer': {
            if (!Array.isArray(value)) {
                return undefined;
            }

            const result: number[] = [];

            for (const item of value) {
                if (item == null) {
                    return undefined;
                }

                if (typeof item === 'number') {
                    if (!Number.isFinite(item)) {
                        return undefined;
                    }

                    result.push(item);
                    continue;
                }

                if (typeof item === 'string') {
                    const trimmed = item.trim();

                    if (trimmed === '') {
                        return undefined;
                    }

                    const parsed = Number.parseInt(trimmed, 10);

                    if (Number.isNaN(parsed)) {
                        return undefined;
                    }

                    result.push(parsed);
                    continue;
                }

                return undefined;
            }

            return result as SectionDataValue;
        }

        case 'collection': {
            if (!Array.isArray(value)) {
                return undefined;
            }

            return value;
        }

        default:
            return value;
    }
}
