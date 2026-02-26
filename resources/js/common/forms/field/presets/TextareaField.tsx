'use client';

import { FormField } from '@/common/forms/field/FormField';
import type { FormErrors } from '@/common/forms/types';
import { Textarea } from '@/components/ui/textarea';
import type { ReactNode } from 'react';

type TextareaFieldProps<FieldName extends string> = {
  name: FieldName;
  id: string;
  value: string;
  errors: FormErrors<FieldName>;
  label: ReactNode;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  className?: string;
  errorId?: string;
  onChange(value: string): void;
};

export function TextareaField<FieldName extends string>({
  name,
  id,
  value,
  errors,
  label,
  required = false,
  placeholder,
  disabled = false,
  rows = 3,
  className,
  errorId,
  onChange,
}: TextareaFieldProps<FieldName>) {
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
        <Textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}
