import { Textarea } from '@/components/ui/textarea';
import type { TemplateFieldControlProps } from '../../types';
import { FieldFrame } from './partials/FieldFrame';

export function TextareaFieldControl({
  value,
  onChange,
  field,
}: TemplateFieldControlProps) {
  const textValue = value as string;

  return (
    <FieldFrame id={field.name} label={field.label} required={field.required}>
      <Textarea
        id={field.name}
        name={field.name}
        value={textValue}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
      />
    </FieldFrame>
  );
}
