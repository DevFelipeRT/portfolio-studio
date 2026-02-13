import { Checkbox } from '@/components/ui/checkbox';
import type { TemplateFieldControlProps } from '../../types';
import { InlineFieldFrame } from './partials/InlineFieldFrame';

export function BooleanFieldControl({
  value,
  onChange,
  field,
}: TemplateFieldControlProps) {
  const checked = value as boolean;

  return (
    <InlineFieldFrame
      id={field.name}
      label={field.label}
      required={field.required}
      rowClassName="bg-muted/40 flex items-start gap-2 rounded-md border px-3 py-2"
    >
      <Checkbox
        id={field.name}
        checked={checked}
        onCheckedChange={(checked) => onChange(Boolean(checked))}
      />
    </InlineFieldFrame>
  );
}
