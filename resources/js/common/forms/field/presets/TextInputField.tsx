'use client';

import { FormField } from '@/common/forms/field/FormField';
import type { FormErrors } from '@/common/forms/types';
import { Input } from '@/components/ui/input';
import type { ReactNode } from 'react';

type TextInputFieldProps<FieldName extends string> = {
  name: FieldName;
  id: string;
  value: string | number;
  errors: FormErrors<FieldName>;
  label: ReactNode;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  errorId?: string;
  onChange(value: string): void;
};

export function TextInputField<FieldName extends string>({
  name,
  id,
  value,
  errors,
  label,
  required = false,
  placeholder,
  disabled = false,
  autoFocus,
  type,
  min,
  max,
  step,
  className,
  errorId,
  onChange,
}: TextInputFieldProps<FieldName>) {
  return (
    <FormField
      name={name}
      errors={errors}
      htmlFor={id}
      label={label}
      required={required}
      errorId={errorId}
      className={className}
    >
      {({ a11yAttributes, getInputClassName }) => (
        <Input
          id={id}
          type={type}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}
