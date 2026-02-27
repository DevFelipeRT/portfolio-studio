'use client';

import { FormField } from '@/common/forms/field/FormField';
import type { FormErrors } from '@/common/forms/types';
import { DatePicker } from '@/components/ui/date-picker';
import type { ReactNode } from 'react';

type DatePickerFieldProps<FieldName extends string> = {
  name: FieldName;
  id: string;
  value: string | null;
  errors: FormErrors<FieldName>;
  label: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  locale?: string;
  supportedLocales?: readonly string[];
  remountKey?: string;
  className?: string;
  errorId?: string;
  onChange(value: string | null): void;
};

export function DatePickerField<FieldName extends string>({
  name,
  id,
  value,
  errors,
  label,
  hint,
  required = false,
  placeholder,
  disabled = false,
  locale,
  supportedLocales,
  remountKey,
  className,
  errorId,
  onChange,
}: DatePickerFieldProps<FieldName>) {
  return (
    <FormField
      name={name}
      errors={errors}
      htmlFor={id}
      label={label}
      hint={hint}
      required={required}
      disabled={disabled}
      errorId={errorId}
      className={className}
    >
      {({ a11yAttributes, getInputClassName }) => (
        <DatePicker
          key={remountKey}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          locale={locale}
          supportedLocales={supportedLocales}
          className={getInputClassName()}
          {...a11yAttributes}
        />
      )}
    </FormField>
  );
}
