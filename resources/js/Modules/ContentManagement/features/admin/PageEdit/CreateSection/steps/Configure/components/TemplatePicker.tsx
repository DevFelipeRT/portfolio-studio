import { Label } from '@/Components/Ui/label';
import type { TemplateDefinitionDto } from '@/Modules/ContentManagement/types';
import { TemplateSelector } from '@/Modules/ContentManagement/features/editor/ui/TemplateSelector';

interface TemplatePickerProps {
  templates: TemplateDefinitionDto[];
  selectedTemplateKey: string;
  onTemplateChange: (templateKey: string) => void;
}

export function TemplatePicker({
  templates,
  selectedTemplateKey,
  onTemplateChange,
}: TemplatePickerProps) {
  return (
    <div className="grid gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="section-template">Template</Label>
        <TemplateSelector
          templates={templates}
          value={selectedTemplateKey}
          onChange={onTemplateChange}
          placeholder="Select a template"
          disabled
          className="h-14 w-full"
        />
      </div>
    </div>
  );
}
