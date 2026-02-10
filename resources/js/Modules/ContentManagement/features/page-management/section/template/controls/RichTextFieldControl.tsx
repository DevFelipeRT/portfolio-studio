import { RichTextEditor } from '@/Common/RichText/RichTextEditor';
import { FieldFrame } from '../components/FieldFrame';
import type { TemplateFieldControlProps } from '../types';

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
