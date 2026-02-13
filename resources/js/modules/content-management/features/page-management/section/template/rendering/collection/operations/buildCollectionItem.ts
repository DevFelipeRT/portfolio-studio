import type {
  SectionDataCollectionItem,
  SectionDataValue,
  TemplateFieldDto,
} from '@/modules/content-management/types';

export function buildCollectionItem(
  itemFieldDefinitions: TemplateFieldDto[],
): SectionDataCollectionItem {
  const newItem: SectionDataCollectionItem = {};

  for (const itemField of itemFieldDefinitions) {
    newItem[itemField.name] = itemField.default_value as SectionDataValue;
  }

  return newItem;
}
