import type { TemplateFieldControlProps } from '../../types';
import { CollectionEmptyState } from './partials/CollectionEmptyState';
import { CollectionHeader } from './partials/CollectionHeader';
import { CollectionItemCard } from './partials/CollectionItemCard';
import { useCollectionItems } from './useCollectionItems';

/**
 * Editor control for template fields of type "collection".
 *
 * Renders a list of items, each item being a record of values for the
 * configured item_fields of the collection field.
 */
export function CollectionFieldControl({
  field,
  value,
  onChange,
}: TemplateFieldControlProps) {
  const { items, itemFieldDefinitions, addItem, removeItem, updateItemField } =
    useCollectionItems({ field, value, onChange });

  return (
    <div className="space-y-3">
      <CollectionHeader label={field.label} onAdd={addItem} />
      <CollectionEmptyState
        hasItems={items.length > 0}
        hasItemFields={itemFieldDefinitions.length > 0}
      />

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, index) => (
          <CollectionItemCard
            key={index}
            index={index}
            item={item}
            itemFieldDefinitions={itemFieldDefinitions}
            onRemove={() => removeItem(index)}
            onChange={(itemFieldName, nextValue) =>
              updateItemField(index, itemFieldName, nextValue)
            }
          />
        ))}
      </div>
    </div>
  );
}
