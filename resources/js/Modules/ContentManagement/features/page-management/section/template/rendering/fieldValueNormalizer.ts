import type {
  SectionDataValue,
  TemplateFieldDto,
} from '@/Modules/ContentManagement/types';
import {
  coerceBoolean,
  coerceIntegerOrNull,
  coerceNumberArray,
  coerceNumberOrNull,
  coerceTrimmedStringOrNull,
  coalesceNullable,
} from '@/Modules/ContentManagement/utils/typeNormalizers';

export function normalizeFieldValue(
  field: TemplateFieldDto,
  value: SectionDataValue | undefined,
): SectionDataValue {
  switch (field.type) {
    case 'string':
      return coerceTrimmedStringOrNull(value) ?? '';

    case 'text':
    case 'rich_text':
      return coerceTrimmedStringOrNull(value) ?? '';

    case 'boolean':
      return coerceBoolean(value);

    case 'integer':
      return coerceIntegerOrNull(value);

    case 'array_integer':
      return coerceNumberArray(value);

    case 'collection':
      return coalesceNullable(value, []);

    case 'image':
      return coerceNumberOrNull(value);

    case 'image_gallery':
      return coerceNumberArray(value);

    default:
      return coerceTrimmedStringOrNull(value);
  }
}
