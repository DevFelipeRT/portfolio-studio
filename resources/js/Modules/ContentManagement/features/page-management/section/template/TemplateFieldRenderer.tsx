import { normalizeFieldValue } from './normalizers';
import { getFieldRenderer } from './registry';
import type { TemplateFieldControlProps } from './types';

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
