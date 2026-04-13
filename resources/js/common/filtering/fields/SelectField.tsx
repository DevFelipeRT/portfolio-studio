import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { useEffect, useRef, useState } from 'react';

export type SelectFieldOption = {
  value: string;
  label: string;
};

export type SelectFieldProps = {
  ariaLabel: string;
  className?: string;
  value: string;
  placeholder: string;
  options: SelectFieldOption[];
  onChange: (value: string) => void;
};

export function SelectField({
  ariaLabel,
  className,
  value,
  placeholder,
  options,
  onChange,
}: SelectFieldProps) {
  const selectedOption =
    value === '' ? null : options.find((option) => option.value === value) ?? null;
  const [inputValue, setInputValue] = useState(selectedOption?.label ?? '');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const optionValues = options.map((option) => option.value);
  const labelByValue = new Map(
    options.map((option) => [option.value, option.label] as const),
  );

  useEffect(() => {
    setInputValue(selectedOption?.label ?? '');
  }, [selectedOption]);

  return (
    <Combobox
      items={optionValues}
      open={open}
      onOpenChange={setOpen}
      itemToStringLabel={(item) => labelByValue.get(item) ?? String(item)}
      itemToStringValue={(item) => String(item)}
      inputValue={inputValue}
      onInputValueChange={(nextValue, eventDetails) => {
        const reason = eventDetails.reason ?? '';

        if (reason === 'clear-press' || reason === 'input-clear') {
          setInputValue('');
          onChange('');
          return;
        }

        setInputValue(nextValue);
      }}
      value={value === '' ? null : value}
      onValueChange={(nextValue, eventDetails) => {
        if (typeof nextValue === 'string') {
          setInputValue(labelByValue.get(nextValue) ?? nextValue);
          onChange(nextValue);
          return;
        }

        const reason = eventDetails.reason ?? '';

        if (reason === 'clear-press' || reason === 'input-clear') {
          setInputValue('');
          onChange('');
        }
      }}
    >
      <ComboboxInput
        ref={inputRef}
        aria-label={ariaLabel}
        className={[
          className,
          open ? 'border-ring ring-1 ring-ring' : '',
          '[&_[data-slot=input-group-addon]]:cursor-default',
          '[&_input]:cursor-default',
        ]
          .filter(Boolean)
          .join(' ')}
        placeholder={placeholder}
        readOnly
        showClear={value !== ''}
        showTrigger
        onMouseDown={(event) => {
          event.preventDefault();
          setOpen((currentOpen) => !currentOpen);
          requestAnimationFrame(() => {
            inputRef.current?.focus();
          });
        }}
      />
      <ComboboxContent>
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
