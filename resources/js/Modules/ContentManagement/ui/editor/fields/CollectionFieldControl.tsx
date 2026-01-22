// resources/js/Modules/ContentManagement/Components/Editor/fields/CollectionFieldControl.tsx

import type {
    SectionDataCollectionItem,
    SectionDataValue,
    TemplateFieldDto,
} from '@/Modules/ContentManagement/core/types';
import React, { JSX } from 'react';
import { TemplateFieldRenderer } from '../TemplateFieldRenderer';

interface CollectionFieldControlProps {
    field: TemplateFieldDto;
    value: SectionDataValue | undefined;
    onChange: (value: SectionDataValue) => void;
}

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
}: CollectionFieldControlProps): JSX.Element {
    const itemFieldDefinitions: TemplateFieldDto[] = React.useMemo(
        () => (Array.isArray(field.item_fields) ? field.item_fields : []),
        [field.item_fields],
    );

    const items: SectionDataCollectionItem[] = React.useMemo(() => {
        if (!Array.isArray(value)) {
            return [];
        }

        return value.filter(
            (item): item is SectionDataCollectionItem =>
                item !== null &&
                typeof item === 'object' &&
                !Array.isArray(item),
        );
    }, [value]);

    const updateItems = (nextItems: SectionDataCollectionItem[]): void => {
        onChange(nextItems);
    };

    const handleItemFieldChange = (
        index: number,
        itemFieldName: string,
        itemFieldValue: SectionDataValue,
    ): void => {
        const nextItems = items.map((item, currentIndex) =>
            currentIndex === index
                ? {
                      ...item,
                      [itemFieldName]: itemFieldValue,
                  }
                : item,
        );

        updateItems(nextItems);
    };

    const handleAddItem = (): void => {
        const newItem: SectionDataCollectionItem = {};

        for (const itemField of itemFieldDefinitions) {
            newItem[itemField.name] =
                itemField.default_value as SectionDataValue;
        }

        updateItems([...items, newItem]);
    };

    const handleRemoveItem = (index: number): void => {
        const nextItems = items.filter(
            (_, currentIndex) => currentIndex !== index,
        );

        updateItems(nextItems);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{field.label}</div>

                <button
                    type="button"
                    onClick={handleAddItem}
                    className="hover:bg-muted inline-flex items-center rounded border px-2 py-1 text-xs font-medium"
                >
                    Add item
                </button>
            </div>

            {items.length === 0 && (
                <p className="text-muted-foreground text-xs">
                    No items configured. Use &ldquo;Add item&rdquo; to create
                    one.
                </p>
            )}

            {itemFieldDefinitions.length === 0 && (
                <p className="text-destructive text-xs">
                    This collection has no item fields defined in the template.
                </p>
            )}

            <div className="grid gap-3 md:grid-cols-2">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="space-y-3 rounded-md border p-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                                Item {index + 1}
                            </div>

                            <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-destructive hover:bg-destructive/5 inline-flex items-center rounded border px-2 py-0.5 text-[0.7rem] font-medium"
                            >
                                Remove
                            </button>
                        </div>

                        <div className="grid gap-3">
                            {itemFieldDefinitions.map((itemField) => (
                                <TemplateFieldRenderer
                                    key={itemField.name}
                                    field={itemField}
                                    value={
                                        item[itemField.name] as SectionDataValue
                                    }
                                    onChange={(nextValue) =>
                                        handleItemFieldChange(
                                            index,
                                            itemField.name,
                                            nextValue,
                                        )
                                    }
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
