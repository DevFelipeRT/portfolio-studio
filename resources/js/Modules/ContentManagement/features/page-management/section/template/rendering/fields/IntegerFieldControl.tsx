import { Input } from '@/Components/Ui/input';
import { parseOptionalInteger } from '@/Modules/ContentManagement/shared/numbers';
import React from 'react';
import { FieldFrame } from '../../components/FieldFrame';
import type { TemplateFieldControlProps } from '../../types';

export function IntegerFieldControl({
  value,
  onChange,
  field,
}: TemplateFieldControlProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const raw = event.target.value;
    onChange(parseOptionalInteger(raw));
  };

  const numericValue = value as number | null;

  return (
    <FieldFrame id={field.name} label={field.label} required={field.required}>
      <Input
        id={field.name}
        name={field.name}
        type="number"
        value={numericValue ?? ''}
        onChange={handleChange}
      />
    </FieldFrame>
  );
}
