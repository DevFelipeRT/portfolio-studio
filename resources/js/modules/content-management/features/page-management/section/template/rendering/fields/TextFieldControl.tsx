import { Input } from '@/components/ui/input';
import type { TemplateFieldControlProps } from '../../types';
import { FieldFrame } from './partials/FieldFrame';

export function TextFieldControl({
  value,
  onChange,
  field,
}: TemplateFieldControlProps) {
  const textValue = value as string;

  return (
    <FieldFrame id={field.name} label={field.label} required={field.required}>
      <Input
        id={field.name}
        name={field.name}
        value={textValue}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldFrame>
  );
}
