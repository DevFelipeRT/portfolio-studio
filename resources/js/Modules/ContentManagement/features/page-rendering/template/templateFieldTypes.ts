import type {
  TemplateDefinitionDto,
  TemplateFieldDto,
  TemplateFieldPrimitiveType,
} from '@/Modules/ContentManagement/types';

/**
 * Builds an index of template field primitive types keyed by field name.
 *
 * - Returns an empty map when the template is missing or `template.fields` is not an array.
 * - For each field, stores `field.type` under `field.name`.
 */
export function buildTemplateFieldTypeIndex(
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
