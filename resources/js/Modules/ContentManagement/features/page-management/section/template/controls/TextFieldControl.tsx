import { Input } from '@/Components/Ui/input';
import { FieldFrame } from '../components/FieldFrame';
import type { TemplateFieldControlProps } from '../types';

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
