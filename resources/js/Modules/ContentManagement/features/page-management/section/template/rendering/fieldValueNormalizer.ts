import type {
  SectionDataValue,
  TemplateFieldDto,
} from '@/Modules/ContentManagement/types';
import {
  coalesceNullable,
  normalizeBoolean,
  normalizeInteger,
  normalizeNumber,
  normalizeNumberArray,
  normalizeString,
} from '@/Modules/ContentManagement/utils/typeNormalizers';

export function normalizeFieldValue(
  field: TemplateFieldDto,
  value: SectionDataValue | undefined,
): SectionDataValue {
  switch (field.type) {
    case 'string':
      return normalizeString(value) ?? '';

    case 'text':
    case 'rich_text':
      return normalizeString(value) ?? '';

    case 'boolean':
      return normalizeBoolean(value);

    case 'integer':
      return normalizeInteger(value);

    case 'array_integer':
      return normalizeNumberArray(value);

    case 'collection':
      return coalesceNullable(value, []);

    case 'image':
      return normalizeNumber(value);

    case 'image_gallery':
      return normalizeNumberArray(value);

    default:
      return normalizeString(value);
  }
}
