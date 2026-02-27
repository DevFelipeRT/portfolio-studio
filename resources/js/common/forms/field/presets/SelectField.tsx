'use client';

import { FormField } from '@/common/forms/field/FormField';
import type { FormErrors } from '@/common/forms/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ReactNode } from 'react';

type SelectOption = {
  value: string;
  label: ReactNode;
};

type SelectFieldProps<FieldName extends string> = {
  name: FieldName;
  id: string;
  value: string;
  errors: FormErrors<FieldName>;
  label: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  options: readonly SelectOption[];
  className?: string;
  errorId?: string;
  onChange(value: string): void;
};

export function SelectField<FieldName extends string>({
  name,
  id,
  value,
  errors,
  label,
  hint,
  required = false,
  placeholder,
  disabled = false,
  options,
  className,
  errorId,
  onChange,
}: SelectFieldProps<FieldName>) {
  return (
    <FormField
      name={name}
      errors={errors}
      htmlFor={id}
      label={label}
      hint={hint}
      required={required}
      disabled={disabled}
      className={className}
      errorId={errorId}
    >
      {({ a11yAttributes, getSelectClassName }) => (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            id={id}
            className={getSelectClassName()}
            {...a11yAttributes}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
}
