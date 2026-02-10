import { parsePositiveIntegerStrict } from '@/Modules/ContentManagement/shared/numbers';
import { FieldFrame } from '../components/FieldFrame';
import type { TemplateFieldControlProps } from '../types';

/**
 * ImageFieldControl renders a basic numeric input for a single image identifier.
 *
 * This control is a minimal implementation and can later be replaced or extended
 * with a full media picker integrated with the Images module.
 */
export function ImageFieldControl({
  value,
  onChange,
  field,
}: TemplateFieldControlProps) {
  const handleChange = (raw: string) => {
    const next = parsePositiveIntegerStrict(raw);

    if (next === undefined) {
      return;
    }

    onChange(next);
  };

  const displayValue = (value as number | null) ?? '';

  return (
    <FieldFrame
      id={field.name}
      label={field.label}
      required={field.required}
      helperText="Use a valid image ID. A dedicated media picker can be integrated here later."
    >
      <input
        id={field.name}
        name={field.name}
        type="text"
        inputMode="numeric"
        pattern="\d*"
        className="border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        value={displayValue}
        onChange={(event) => handleChange(event.target.value)}
      />
    </FieldFrame>
  );
}
