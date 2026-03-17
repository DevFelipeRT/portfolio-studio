import { Input } from '@/components/ui/input';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import { parseCommaSeparatedIntegers } from '@/modules/content-management/utils/numbers';
import React from 'react';
import type { TemplateFieldControlProps } from '../../types';
import { FieldFrame } from './partials/FieldFrame';

/**
 * Simple comma-separated integer list control.
 */
export function ArrayIntegerFieldControl({
  value,
  onChange,
  field,
}: TemplateFieldControlProps) {
  const { translate: tTemplates } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.templates,
  );
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
      helperText={tTemplates(
        'helpers.integerArray',
        'Comma-separated list of integer identifiers.',
      )}
    >
      <Input
        id={field.name}
        name={field.name}
        value={textValue}
        onChange={handleChange}
        placeholder={tTemplates('helpers.integerArrayPlaceholder', '1, 2, 3')}
      />
    </FieldFrame>
  );
}
