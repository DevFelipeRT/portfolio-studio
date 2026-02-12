import type { TemplateFieldDto } from '@/Modules/ContentManagement/types';

export function getItemFieldDefinitions(
  field: TemplateFieldDto,
): TemplateFieldDto[] {
  return Array.isArray(field.item_fields) ? field.item_fields : [];
}
