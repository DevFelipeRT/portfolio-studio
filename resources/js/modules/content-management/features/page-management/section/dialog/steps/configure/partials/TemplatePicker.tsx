import { Label } from '@/components/ui/label';
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
  const id = `${idPrefix}-template`;

  return (
    <div className="grid gap-4">
      <div className="space-y-1.5">
        <Label htmlFor={id}>Template</Label>
        <TemplateSelector
          templates={templates}
          value={selectedTemplateKey}
          onChange={onTemplateChange}
          placeholder="Select a template"
          disabled={disabled}
          className="h-14 w-full"
        />
      </div>
    </div>
  );
}
