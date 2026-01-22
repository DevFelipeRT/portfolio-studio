// resources/js/Modules/ContentManagement/utils/sectionFieldResolver.ts
import type {
    SectionData,
    SectionDataValue,
    TemplateDefinitionDto,
    TemplateFieldPrimitiveType,
} from '@/Modules/ContentManagement/core/types';
import { buildTemplateDefaults } from '@/Modules/ContentManagement/core/sections/fields/fieldDefaults';
import { buildFieldTypeIndex } from '@/Modules/ContentManagement/core/sections/fields/fieldTypes';
import { normalizeValue } from '@/Modules/ContentManagement/core/sections/fields/fieldNormalization';

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
