'use client';

import { FormField } from '@/common/forms/field/FormField';
import type { FormErrors } from '@/common/forms/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type CheckboxItem = {
  id: string;
  label: ReactNode;
  value: boolean;
  disabled?: boolean;
  onChange(value: boolean): void;
};

type CheckboxFieldBaseProps<FieldName extends string> = {
  name: FieldName;
  errors: FormErrors<FieldName>;
  label: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
  errorId?: string;
};

type CheckboxFieldSingleProps<FieldName extends string> =
  CheckboxFieldBaseProps<FieldName> & {
    id: string;
    value: boolean;
    disabled?: boolean;
    onChange(value: boolean): void;
    items?: undefined;
  };

type CheckboxFieldMultiProps<FieldName extends string> =
  CheckboxFieldBaseProps<FieldName> & {
    items: readonly CheckboxItem[];
    id?: undefined;
    value?: undefined;
    disabled?: undefined;
    onChange?: undefined;
  };

type CheckboxFieldProps<FieldName extends string> =
  | CheckboxFieldSingleProps<FieldName>
  | CheckboxFieldMultiProps<FieldName>;

function isMulti<FieldName extends string>(
  props: CheckboxFieldProps<FieldName>,
): props is CheckboxFieldMultiProps<FieldName> {
  return Array.isArray((props as CheckboxFieldMultiProps<FieldName>).items);
}

export function CheckboxField<FieldName extends string>(
  props: CheckboxFieldProps<FieldName>,
) {
  const {
    name,
    errors,
    label,
    hint,
    required = false,
    className,
    errorId,
  } = props;

  return (
    <FormField
      name={name}
      errors={errors}
      htmlFor={isMulti(props) ? `${name}-group` : props.id}
      label={label}
      hint={hint}
      required={required}
      disabled={isMulti(props) ? false : Boolean(props.disabled)}
      errorId={errorId}
      className={className}
      variant={isMulti(props) ? 'group' : 'inline'}
    >
      {({ a11yAttributes, hasError }) => {
        if (isMulti(props)) {
          return (
            <div
              {...a11yAttributes}
              className={cn(
                'border-input bg-background focus-within:ring-ring w-full space-y-2 rounded-md border p-3 shadow-sm focus-within:ring-1',
                hasError && 'border-destructive focus-within:ring-destructive',
              )}
            >
              {props.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Checkbox
                    id={item.id}
                    checked={item.value}
                    disabled={item.disabled}
                    onCheckedChange={(checked) => item.onChange(!!checked)}
                  />
                  <Label htmlFor={item.id}>{item.label}</Label>
                </div>
              ))}
            </div>
          );
        }

        return (
          <Checkbox
            id={props.id}
            checked={props.value}
            disabled={props.disabled}
            onCheckedChange={(checked) => props.onChange(!!checked)}
            {...a11yAttributes}
          />
        );
      }}
    </FormField>
  );
}
