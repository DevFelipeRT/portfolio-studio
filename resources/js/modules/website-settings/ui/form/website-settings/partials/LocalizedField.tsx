import { FormField, type FormErrors } from '@/common/forms';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

type LocalizedFieldType = 'input' | 'textarea';

interface LocalizedFieldProps {
  id: string;
  label: string;
  locales: string[];
  values: Record<string, string>;
  onChange(locale: string, value: string): void;
  errors: FormErrors;
  type?: LocalizedFieldType;
  placeholder?: string;
  description?: string;
}

export function LocalizedField({
  id,
  label,
  locales,
  values,
  onChange,
  errors,
  type = 'input',
  placeholder,
  description,
}: LocalizedFieldProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="text-sm leading-none font-medium">{label}</div>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {locales.map((locale) => {
          const fieldId = `${id}-${locale}`;

          return (
            <FormField
              key={fieldId}
              name={`${id}.${locale}`}
              errors={errors}
              htmlFor={fieldId}
              label={<span className="text-xs uppercase">{locale}</span>}
              errorId={`${fieldId}-error`}
            >
              {({ a11yAttributes, getInputClassName }) =>
                type === 'textarea' ? (
                  <Textarea
                    id={fieldId}
                    value={values[locale] ?? ''}
                    onChange={(event) => onChange(locale, event.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className={getInputClassName()}
                    {...a11yAttributes}
                  />
                ) : (
                  <Input
                    id={fieldId}
                    value={values[locale] ?? ''}
                    onChange={(event) => onChange(locale, event.target.value)}
                    placeholder={placeholder}
                    className={getInputClassName()}
                    {...a11yAttributes}
                  />
                )
              }
            </FormField>
          );
        })}
      </div>
    </div>
  );
}

