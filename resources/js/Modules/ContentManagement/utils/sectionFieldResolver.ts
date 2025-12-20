import type {
    SectionData,
    SectionDataValue,
    TemplateDefinitionDto,
    TemplateFieldDto,
} from '@/Modules/ContentManagement/types';

export interface SectionFieldResolver {
    /**
     * Returns the resolved value for a given field name, using
     * section data when present or template defaults as fallback.
     */
    getValue<TValue = SectionDataValue>(fieldName: string): TValue | undefined;
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

/**
 * Creates a field resolver bound to a specific section data payload
 * and its template definition.
 */
export function createSectionFieldResolver(
    data: SectionData | null | undefined,
    template?: TemplateDefinitionDto,
): SectionFieldResolver {
    const safeData: SectionData = data ?? {};
    const defaults = buildTemplateDefaults(template);

    return {
        getValue<TValue = SectionDataValue>(
            fieldName: string,
        ): TValue | undefined {
            if (Object.prototype.hasOwnProperty.call(safeData, fieldName)) {
                return safeData[fieldName] as TValue;
            }

            if (Object.prototype.hasOwnProperty.call(defaults, fieldName)) {
                return defaults[fieldName] as TValue;
            }

            return undefined;
        },
    };
}
