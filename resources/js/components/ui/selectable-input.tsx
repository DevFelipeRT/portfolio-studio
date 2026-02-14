import * as React from 'react';

import {
    Combobox,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';

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
    const [draftValue, setDraftValue] = React.useState(value);

    React.useEffect(() => {
        setDraftValue(value);
    }, [value]);

    const isUserInputChange = React.useCallback(
        (eventDetails?: { reason?: string; event?: Event }) => {
            const reason = eventDetails?.reason ?? '';

            if (
                reason === 'input-change' ||
                reason === 'input-paste' ||
                reason === 'clear-press'
            ) {
                return true;
            }

            return reason === 'input-clear' && eventDetails?.event != null;
        },
        [],
    );

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

    const handleInputValueChange = React.useCallback(
        (
            nextValue: string,
            eventDetails: { reason?: string; event?: Event },
        ) => {
            if (!isUserInputChange(eventDetails)) {
                return;
            }

            setDraftValue(nextValue);
            onChange(nextValue);
        },
        [isUserInputChange, onChange],
    );

    return (
        <Combobox
            items={items}
            itemToStringLabel={(item) => labelByValue.get(item) ?? String(item)}
            itemToStringValue={(item) => String(item)}
            inputValue={draftValue}
            onInputValueChange={handleInputValueChange}
            value={draftValue.trim() === '' ? null : draftValue}
            onValueChange={(nextValue, eventDetails) => {
                if (typeof nextValue === 'string') {
                    setDraftValue(nextValue);
                    onChange(nextValue);
                } else if (nextValue === null && isUserInputChange(eventDetails)) {
                    setDraftValue('');
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
