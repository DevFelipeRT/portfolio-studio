import type {
  SectionDataCollectionItem,
  SectionDataValue,
  TemplateFieldDto,
} from '@/Modules/ContentManagement/types';
import React from 'react';
import { buildCollectionItem } from './operations/buildCollectionItem';
import { getCollectionItems } from './operations/getCollectionItems';
import { getItemFieldDefinitions } from './operations/getItemFieldDefinitions';
import { updateCollectionItemField } from './operations/updateCollectionItemField';

interface UseCollectionItemsArgs {
  field: TemplateFieldDto;
  value: SectionDataValue | undefined;
  onChange: (value: SectionDataValue) => void;
}

export function useCollectionItems({
  field,
  value,
  onChange,
}: UseCollectionItemsArgs) {
  const itemFieldDefinitions: TemplateFieldDto[] = React.useMemo(
    () => getItemFieldDefinitions(field),
    [field.item_fields],
  );

  const items: SectionDataCollectionItem[] = React.useMemo(() => {
    return getCollectionItems(value);
  }, [value]);

  const updateItems = (nextItems: SectionDataCollectionItem[]): void => {
    onChange(nextItems);
  };

  const updateItemField = (
    index: number,
    itemFieldName: string,
    itemFieldValue: SectionDataValue,
  ): void => {
    const nextItems = updateCollectionItemField(
      items,
      index,
      itemFieldName,
      itemFieldValue,
    );

    updateItems(nextItems);
  };

  const addItem = (): void => {
    const newItem = buildCollectionItem(itemFieldDefinitions);

    updateItems([...items, newItem]);
  };

  const removeItem = (index: number): void => {
    const nextItems = items.filter((_, currentIndex) => currentIndex !== index);
    updateItems(nextItems);
  };

  return {
    items,
    itemFieldDefinitions,
    addItem,
    removeItem,
    updateItemField,
  };
}
