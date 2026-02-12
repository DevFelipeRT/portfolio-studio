import { Input } from '@/Components/Ui/input';
import { parseCommaSeparatedIntegers } from '@/Modules/ContentManagement/shared/numbers';
import React from 'react';
import { FieldFrame } from '../../components/FieldFrame';
import type { TemplateFieldControlProps } from '../../types';

/**
 * Simple comma-separated integer list control.
 */
export function ArrayIntegerFieldControl({
  value,
  onChange,
  field,
}: TemplateFieldControlProps) {
  const numericValue = value as number[];
  const textValue = numericValue.join(', ');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const raw = event.target.value;
    onChange(parseCommaSeparatedIntegers(raw));
  };

  return (
    <FieldFrame
      id={field.name}
      label={field.label}
      helperText="Comma-separated list of integer identifiers."
    >
      <Input
        id={field.name}
        name={field.name}
        value={textValue}
        onChange={handleChange}
        placeholder="1, 2, 3"
      />
    </FieldFrame>
  );
}
