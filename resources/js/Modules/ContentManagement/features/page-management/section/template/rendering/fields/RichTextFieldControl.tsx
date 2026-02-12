import { RichTextEditor } from '@/Common/RichText/RichTextEditor';
import type { TemplateFieldControlProps } from '../../types';
import { FieldFrame } from './partials/FieldFrame';

export function RichTextFieldControl({
  value,
  onChange,
  field,
}: TemplateFieldControlProps) {
  const editorId = `${field.name}-rich-text`;
  const textValue = value as string;

  return (
    <FieldFrame
      id={editorId}
      label={field.label}
      required={field.required}
      helperText="Rich text content stored as JSON."
    >
      <RichTextEditor id={editorId} value={textValue} onChange={onChange} />
    </FieldFrame>
  );
}
