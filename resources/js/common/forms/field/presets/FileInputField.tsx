'use client';

import { FormField } from '@/common/forms/field/FormField';
import type { FormErrors } from '@/common/forms/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

type FileInputFieldProps<FieldName extends string> = {
  name: FieldName;
  id: string;
  errors: FormErrors<FieldName>;
  label: ReactNode;
  placeholder?: ReactNode;
  hint?: ReactNode;
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
  placeholder,
  hint,
  required = false,
  disabled = false,
  accept,
  className,
  errorId,
  onChange,
}: FileInputFieldProps<FieldName>) {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const buttonText = fileName ?? placeholder ?? label;

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
        <div>
          <input
            id={id}
            type="file"
            accept={accept}
            disabled={disabled}
            onChange={(event) => {
              const nextFileName = event.target.files?.[0]?.name ?? null;
              setFileName(nextFileName);
              onChange(event);
            }}
            className={cn('peer sr-only', getInputClassName())}
            ref={inputRef}
            {...a11yAttributes}
          />
          <ButtonGroup className="w-full">
            <label
              htmlFor={id}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'peer-focus-visible:ring-ring w-full flex-1 cursor-pointer justify-start gap-2 truncate text-left peer-focus-visible:ring-1',
                getInputClassName(),
                disabled && 'pointer-events-none opacity-50',
              )}
            >
              <span
                className={cn('truncate', !fileName && 'text-muted-foreground')}
              >
                {buttonText}
              </span>
            </label>

            {fileName && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={disabled}
                onClick={() => {
                  if (!inputRef.current) return;
                  inputRef.current.value = '';
                  setFileName(null);
                  onChange({
                    target: inputRef.current,
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                className="h-8 w-8 cursor-pointer"
                aria-label="Remove selected file"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </ButtonGroup>
        </div>
      )}
    </FormField>
  );
}
