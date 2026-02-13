import type {
  SectionData,
  SectionDataValue,
  TemplateDefinitionDto,
  TemplateFieldDto,
} from '@/modules/content-management/types';

/**
 * Builds an object with default values indexed by template field name.
 *
 * - Returns an empty object when the template is missing or `template.fields` is not an array.
 * - Adds one entry per field whose `default_value` is not `undefined`.
 */
export function buildTemplateFieldDefaults(
  template?: TemplateDefinitionDto,
): SectionData {
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
