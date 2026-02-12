import type {
  SectionDataCollectionItem,
  SectionDataValue,
} from '@/Modules/ContentManagement/types';

export function getCollectionItems(
  value: SectionDataValue | undefined,
): SectionDataCollectionItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is SectionDataCollectionItem =>
      item !== null && typeof item === 'object' && !Array.isArray(item),
  );
}
