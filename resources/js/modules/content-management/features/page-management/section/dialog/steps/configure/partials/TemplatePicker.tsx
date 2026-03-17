import { Label } from '@/components/ui/label';
import {
  CONTENT_MANAGEMENT_NAMESPACES,
  useContentManagementTranslation,
} from '@/modules/content-management/i18n';
import { TemplateSelector } from '@/modules/content-management/features/page-management/section/template';
import type { TemplateDefinitionDto } from '@/modules/content-management/types';

interface TemplatePickerProps {
  idPrefix: string;
  templates: TemplateDefinitionDto[];
  selectedTemplateKey: string;
  disabled?: boolean;
  onTemplateChange: (templateKey: string) => void;
}

export function TemplatePicker({
  idPrefix,
  templates,
  selectedTemplateKey,
  disabled = false,
  onTemplateChange,
}: TemplatePickerProps) {
  const { translate: tSections } = useContentManagementTranslation(
    CONTENT_MANAGEMENT_NAMESPACES.sections,
  );
  const id = `${idPrefix}-template`;

  return (
    <div className="grid gap-4">
      <div className="space-y-1.5">
        <Label htmlFor={id}>{tSections('fields.template', 'Template')}</Label>
        <TemplateSelector
          templates={templates}
          value={selectedTemplateKey}
          onChange={onTemplateChange}
          placeholder={tSections(
            'fields.templatePlaceholder',
            'Select a template',
          )}
          disabled={disabled}
          className="h-14 w-full"
        />
      </div>
    </div>
  );
}
