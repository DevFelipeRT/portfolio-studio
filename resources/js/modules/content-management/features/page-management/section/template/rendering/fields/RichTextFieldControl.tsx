import { RichTextEditor } from '@/common/rich-text/RichTextEditor';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import type { TemplateFieldControlProps } from '../../types';
import { FieldFrame } from './partials/FieldFrame';

export function RichTextFieldControl({
  value,
  onChange,
  field,
}: TemplateFieldControlProps) {
  const { translate: tTemplates } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.templates,
  );
  const editorId = `${field.name}-rich-text`;
  const textValue = value as string;

  return (
    <FieldFrame
      id={editorId}
      label={field.label}
      required={field.required}
      helperText={tTemplates(
        'helpers.richText',
        'Rich text content stored as JSON.',
      )}
    >
      <RichTextEditor id={editorId} value={textValue} onChange={onChange} />
    </FieldFrame>
  );
}
