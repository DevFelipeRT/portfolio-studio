'use client';

import { FormField } from '@/common/forms/field/FormField';
import type { FormErrors } from '@/common/forms/types';
import { RichTextEditor } from '@/common/rich-text/RichTextEditor';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type RichTextFieldProps<FieldName extends string> = {
  name: FieldName;
  id: string;
  value: string;
  errors: FormErrors<FieldName>;
  label: ReactNode;
  hint?: ReactNode;
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
  hint,
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
      hint={hint}
      required={required}
      disabled={disabled}
      errorId={errorId}
      className={className}
    >
      {({ a11yAttributes, hasError }) => (
        <RichTextEditor
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          editable={!disabled}
          contentWrapperClassName={cn(
            'min-h-[78px] resize-y overflow-auto',
            hasError && 'border-destructive focus-within:ring-destructive',
          )}
          editorClassName="min-h-[60px]"
          contentEditableProps={a11yAttributes}
        />
      )}
    </FormField>
  );
}
