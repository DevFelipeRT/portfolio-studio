import type { TemplateFieldDto } from '@/modules/content-management/types';

export function getItemFieldDefinitions(
  field: TemplateFieldDto,
): TemplateFieldDto[] {
  return Array.isArray(field.item_fields) ? field.item_fields : [];
}
