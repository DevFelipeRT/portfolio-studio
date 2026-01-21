import * as React from 'react';

import {
    Combobox,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/Components/Ui/combobox';

export type SelectableInputOption = {
    value: string;
    label?: string;
};

type SelectableInputProps = {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectableInputOption[];
    placeholder?: string;
    emptyLabel?: string;
    disabled?: boolean;
    portalContainer?: React.ComponentProps<
        typeof ComboboxContent
    >['portalContainer'];
};

export function SelectableInput({
    id,
    value,
    onChange,
    options,
    placeholder,
    emptyLabel = 'No options',
    disabled = false,
    portalContainer,
}: SelectableInputProps) {
    const items = React.useMemo(
        () => options.map((option) => option.value),
        [options],
    );

    const labelByValue = React.useMemo(() => {
        const map = new Map<string, string>();
        options.forEach((option) => {
            map.set(option.value, option.label ?? option.value);
        });
        return map;
    }, [options]);

    const matchedValue = React.useMemo(
        () => (items.includes(value) ? value : null),
        [items, value],
    );

    const handleInputValueChange = React.useCallback(
        (nextValue: string, eventDetails: { reason?: string }) => {
            if (eventDetails?.reason === 'item-press') {
                return;
            }

            onChange(nextValue);
        },
        [onChange],
    );

    return (
        <Combobox
            items={items}
            itemToStringLabel={(item) => labelByValue.get(item) ?? String(item)}
            itemToStringValue={(item) => String(item)}
            inputValue={value}
            onInputValueChange={handleInputValueChange}
            value={matchedValue}
            onValueChange={(nextValue) => {
                if (typeof nextValue === 'string') {
                    onChange(nextValue);
                } else if (nextValue === null) {
                    onChange('');
                }
            }}
        >
            <ComboboxInput
                id={id}
                placeholder={placeholder}
                disabled={disabled}
                showClear
                showTrigger
            />
            <ComboboxContent portalContainer={portalContainer}>
                <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
                <ComboboxList>
                    <ComboboxCollection>
                        {(item) => (
                            <ComboboxItem key={item} value={item}>
                                {labelByValue.get(item) ?? item}
                            </ComboboxItem>
                        )}
                    </ComboboxCollection>
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
