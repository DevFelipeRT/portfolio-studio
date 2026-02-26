'use client';

import { FormField } from '@/common/forms/field/FormField';
import type { FormErrors } from '@/common/forms/types';
import { Input } from '@/components/ui/input';
import type { ReactNode } from 'react';

type FileInputFieldProps<FieldName extends string> = {
  name: FieldName;
  id: string;
  errors: FormErrors<FieldName>;
  label: ReactNode;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  className?: string;
  errorId?: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
};

export function FileInputField<FieldName extends string>({
  name,
  id,
  errors,
  label,
  required = false,
  disabled = false,
  accept,
  className,
  errorId,
  onChange,
}: FileInputFieldProps<FieldName>) {
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
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={onChange}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}

