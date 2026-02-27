import {
  CollectionField,
  TextInputField,
  TextareaField,
  type FormErrors,
} from '@/common/forms';

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
      <CollectionField
        name={id}
        items={locales}
        errors={errors as FormErrors<string>}
        className="grid gap-3 md:grid-cols-2"
        renderItem={(locale) => {
          const fieldId = `${id}-${locale}`;
          const localeLabel = (
            <span className="text-xs uppercase">{locale}</span>
          );

          return type === 'textarea' ? (
            <TextareaField
              key={fieldId}
              name={`${id}.${locale}`}
              id={fieldId}
              value={values[locale] ?? ''}
              errors={errors as FormErrors<string>}
              label={localeLabel}
              errorId={`${fieldId}-error`}
              placeholder={placeholder}
              rows={3}
              onChange={(value) => onChange(locale, value)}
            />
          ) : (
            <TextInputField
              key={fieldId}
              name={`${id}.${locale}`}
              id={fieldId}
              value={values[locale] ?? ''}
              errors={errors as FormErrors<string>}
              label={localeLabel}
              errorId={`${fieldId}-error`}
              placeholder={placeholder}
              onChange={(value) => onChange(locale, value)}
            />
          );
        }}
      />
    </div>
  );
}
