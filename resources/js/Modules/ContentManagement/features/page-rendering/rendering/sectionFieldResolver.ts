// resources/js/Modules/ContentManagement/utils/sectionFieldResolver.ts
import type {
  SectionData,
  SectionDataValue,
  TemplateDefinitionDto,
  TemplateFieldPrimitiveType,
} from '@/Modules/ContentManagement/types';
import {
  buildTemplateFieldDefaults,
  buildTemplateFieldTypeIndex,
  normalizeTemplateFieldValue,
} from '../template';
import { SectionFieldResolver } from '../types';

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
  const defaults = buildTemplateFieldDefaults(template);
  const fieldTypes = buildTemplateFieldTypeIndex(template);

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
          const normalizedFromData = normalizeTemplateFieldValue(
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
          const normalizedFromDefault = normalizeTemplateFieldValue(
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
