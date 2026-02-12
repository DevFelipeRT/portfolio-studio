import type {
  SectionDataValue,
  TemplateFieldPrimitiveType,
} from '@/Modules/ContentManagement/types';
import {
  normalizeValueAsBoolean,
  normalizeValueAsCollectionArray,
  normalizeValueAsInteger,
  normalizeValueAsIntegerArray,
  normalizeValueAsTrimmedString,
} from './helpers';

/**
 * Normalizes a template field value according to a primitive type.
 *
 * - Returns the original value when `fieldType` is `undefined`.
 * - Dispatches to type-specific normalizers for supported primitive types.
 * - Returns `undefined` when normalization fails for a supported type.
 * - For unsupported primitive types, returns the original value.
 */
export function normalizeTemplateFieldValue(
  value: SectionDataValue,
  fieldType?: TemplateFieldPrimitiveType,
): SectionDataValue | undefined {
  if (fieldType === undefined) {
    return value;
  }

  switch (fieldType) {
    case 'string':
    case 'text':
    case 'rich_text': {
      return normalizeValueAsTrimmedString(value);
    }

    case 'integer': {
      return normalizeValueAsInteger(value);
    }

    case 'boolean': {
      return normalizeValueAsBoolean(value);
    }

    case 'array_integer': {
      return normalizeValueAsIntegerArray(value);
    }

    case 'collection': {
      return normalizeValueAsCollectionArray(value);
    }

    default:
      return value;
  }
}
