// resources/js/Modules/ContentManagement/utils/sectionFieldResolver.ts
import type {
    SectionData,
    SectionDataValue,
    TemplateDefinitionDto,
    TemplateFieldDto,
    TemplateFieldPrimitiveType,
} from '@/Modules/ContentManagement/types';

export interface SectionFieldResolver {
    /**
     * Returns the resolved and normalized value for a given field name.
     *
     * Resolution rules:
     * - Non-empty values from section data have highest precedence.
     * - If section data does not provide a usable value, template defaults are used.
     * - Empty or whitespace-only strings are treated as "no value" to allow fallbacks.
     * - Null and undefined are treated as "no value".
     * - When a primitive type is available (or provided), normalization is applied.
     */
    getValue<TValue = SectionDataValue>(
        fieldName: string,
        expectedType?: TemplateFieldPrimitiveType,
    ): TValue | undefined;
}

function buildTemplateDefaults(template?: TemplateDefinitionDto): SectionData {
    if (!template || !Array.isArray(template.fields)) {
        return {};
    }

    const defaults: SectionData = {};

    for (const field of template.fields as TemplateFieldDto[]) {
        if (field.default_value !== undefined) {
            defaults[field.name] = field.default_value as SectionDataValue;
        }
    }

    return defaults;
}

function buildFieldTypeIndex(
    template?: TemplateDefinitionDto,
): Map<string, TemplateFieldPrimitiveType> {
    const index = new Map<string, TemplateFieldPrimitiveType>();

    if (!template || !Array.isArray(template.fields)) {
        return index;
    }

    for (const field of template.fields as TemplateFieldDto[]) {
        index.set(field.name, field.type);
    }

    return index;
}

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

function normalizeValue(
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

/**
 * Creates a field resolver bound to a specific section data payload and its template definition.
 *
 * Precedence and blank-handling rules:
 * - Section data is evaluated first; if normalization returns a usable value, it is returned.
 * - If section data does not yield a usable value (including empty strings), template defaults are evaluated.
 * - If template defaults also do not yield a usable value, undefined is returned.
 */
export function createSectionFieldResolver(
    data: SectionData | null | undefined,
    template?: TemplateDefinitionDto,
): SectionFieldResolver {
    const safeData: SectionData = data ?? {};
    const defaults = buildTemplateDefaults(template);
    const fieldTypes = buildFieldTypeIndex(template);

    return {
        getValue<TValue = SectionDataValue>(
            fieldName: string,
            expectedType?: TemplateFieldPrimitiveType,
        ): TValue | undefined {
            const primitiveType =
                expectedType ?? fieldTypes.get(fieldName) ?? undefined;

            let resolved: SectionDataValue | undefined;

            if (Object.prototype.hasOwnProperty.call(safeData, fieldName)) {
                const rawFromData = safeData[fieldName];

                if (rawFromData !== undefined && rawFromData !== null) {
                    const normalizedFromData = normalizeValue(
                        rawFromData,
                        primitiveType,
                    );

                    if (normalizedFromData !== undefined) {
                        resolved = normalizedFromData;
                    }
                }
            }

            if (
                resolved === undefined &&
                Object.prototype.hasOwnProperty.call(defaults, fieldName)
            ) {
                const rawFromDefault = defaults[fieldName];

                if (rawFromDefault !== undefined && rawFromDefault !== null) {
                    const normalizedFromDefault = normalizeValue(
                        rawFromDefault,
                        primitiveType,
                    );

                    if (normalizedFromDefault !== undefined) {
                        resolved = normalizedFromDefault;
                    }
                }
            }

            if (resolved === undefined) {
                return undefined;
            }

            return resolved as TValue;
        },
    };
}
