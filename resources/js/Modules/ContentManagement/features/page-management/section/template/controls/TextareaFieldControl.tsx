import { Textarea } from '@/Components/Ui/textarea';
import { FieldFrame } from '../components/FieldFrame';
import type { TemplateFieldControlProps } from '../types';

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
