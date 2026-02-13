import type {
  TemplateData,
  TemplateDefinitionDto,
} from '@/modules/content-management/types';

export function resolveDefaultData(
  template: TemplateDefinitionDto,
): TemplateData {
  const defaults: Partial<TemplateData> = {};

  for (const field of template.fields) {
    if (field.default_value !== null && field.default_value !== undefined) {
      defaults[field.name] = field.default_value as never;
      continue;
    }

    switch (field.type) {
      case 'boolean':
        defaults[field.name] = false as never;
        break;
      case 'integer':
        defaults[field.name] = null as never;
        break;
      case 'array_integer':
        defaults[field.name] = [] as never;
        break;
      case 'collection':
        defaults[field.name] = [] as never;
        break;
      case 'image':
        defaults[field.name] = null as never;
        break;
      case 'image_gallery':
        defaults[field.name] = [] as never;
        break;
      default:
        defaults[field.name] = '' as never;
        break;
    }
  }

  return defaults as TemplateData;
}
