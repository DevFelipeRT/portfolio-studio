'use client';

import { FormField } from '@/common/forms/field/FormField';
import type { FormErrors } from '@/common/forms/types';
import { RichTextEditor } from '@/common/rich-text/RichTextEditor';
import type { ReactNode } from 'react';

type RichTextFieldProps<FieldName extends string> = {
  name: FieldName;
  id: string;
  value: string;
  errors: FormErrors<FieldName>;
  label: ReactNode;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  errorId?: string;
  onChange(value: string): void;
};

export function RichTextField<FieldName extends string>({
  name,
  id,
  value,
  errors,
  label,
  required = false,
  placeholder,
  disabled = false,
  className,
  errorId,
  onChange,
}: RichTextFieldProps<FieldName>) {
  return (
    <FormField
      name={name}
      errors={errors}
      htmlFor={`${id}-lexical-editor`}
      label={label}
      required={required}
      errorId={errorId}
      className={className}
    >
      {({ a11yAttributes }) => (
        <RichTextEditor
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          editable={!disabled}
          contentEditableProps={a11yAttributes}
        />
      )}
    </FormField>
  );
}
