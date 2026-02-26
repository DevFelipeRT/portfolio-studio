'use client';

import { FormField } from '@/common/forms/field/FormField';
import type { FormErrors } from '@/common/forms/types';
import { Checkbox } from '@/components/ui/checkbox';
import type { ReactNode } from 'react';

type CheckboxFieldProps<FieldName extends string> = {
  name: FieldName;
  id: string;
  value: boolean;
  errors: FormErrors<FieldName>;
  label: ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  errorId?: string;
  onChange(value: boolean): void;
};

export function CheckboxField<FieldName extends string>({
  name,
  id,
  value,
  errors,
  label,
  required = false,
  disabled = false,
  className,
  errorId,
  onChange,
}: CheckboxFieldProps<FieldName>) {
  return (
    <FormField
      name={name}
      errors={errors}
      htmlFor={id}
      label={label}
      required={required}
      errorId={errorId}
      className={className}
      variant="inline"
    >
      {({ a11yAttributes }) => (
        <Checkbox
          id={id}
          checked={value}
          disabled={disabled}
          onCheckedChange={(checked) => onChange(!!checked)}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}
