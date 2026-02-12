import type { TemplateFieldControlProps } from '../types';
import { normalizeFieldValue } from './fieldValueNormalizer';
import { getFieldRenderer } from './registry';

/**
 * Dispatches a template field to the appropriate concrete control.
 */
export function TemplateFieldRenderer({
  field,
  value,
  onChange,
}: TemplateFieldControlProps) {
  const normalizedValue = normalizeFieldValue(field, value);
  const Renderer = getFieldRenderer(field.type);

  return <Renderer field={field} value={normalizedValue} onChange={onChange} />;
}
