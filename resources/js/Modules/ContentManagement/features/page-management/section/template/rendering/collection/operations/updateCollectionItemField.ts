import type {
  SectionDataCollectionItem,
  SectionDataValue,
} from '@/Modules/ContentManagement/types';

export function updateCollectionItemField(
  items: SectionDataCollectionItem[],
  index: number,
  itemFieldName: string,
  itemFieldValue: SectionDataValue,
): SectionDataCollectionItem[] {
  return items.map((item, currentIndex) =>
    currentIndex === index
      ? {
          ...item,
          [itemFieldName]: itemFieldValue,
        }
      : item,
  );
}
