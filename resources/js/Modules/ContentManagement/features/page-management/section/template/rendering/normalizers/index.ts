import type {
  SectionDataValue,
  TemplateFieldDto,
} from '@/Modules/ContentManagement/types';
import { normalizeArrayInteger } from './array_integer';
import { normalizeBoolean } from './boolean';
import { normalizeCollection } from './collection';
import { normalizeImage } from './image';
import { normalizeImageGallery } from './image_gallery';
import { normalizeInteger } from './integer';
import { normalizeString } from './string';

export function normalizeFieldValue(
  field: TemplateFieldDto,
  value: SectionDataValue | undefined,
): SectionDataValue {
  switch (field.type) {
    case 'string':
      return normalizeString(value);

    case 'text':
    case 'rich_text':
      return normalizeString(value);

    case 'boolean':
      return normalizeBoolean(value);

    case 'integer':
      return normalizeInteger(value);

    case 'array_integer':
      return normalizeArrayInteger(value);

    case 'collection':
      return normalizeCollection(value);

    case 'image':
      return normalizeImage(value);

    case 'image_gallery':
      return normalizeImageGallery(value);

    default:
      return normalizeString(value);
  }
}
