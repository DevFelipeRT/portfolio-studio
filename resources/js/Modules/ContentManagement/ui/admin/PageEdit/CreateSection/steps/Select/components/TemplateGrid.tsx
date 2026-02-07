import type { TemplateDefinitionDto } from '@/Modules/ContentManagement/core/types';
import { TemplateCard } from '@/Modules/ContentManagement/ui/admin/PageEdit/CreateSection/steps/Select/components/TemplateCard';

interface TemplateGridProps {
  templates: TemplateDefinitionDto[];
  selectedTemplateKey: string;
  onSelectTemplate: (templateKey: string) => void;
}

export function TemplateGrid({
  templates,
  selectedTemplateKey,
  onSelectTemplate,
}: TemplateGridProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {templates.map((template) => (
        <TemplateCard
          key={template.key}
          template={template}
          isSelected={template.key === selectedTemplateKey}
          onSelect={onSelectTemplate}
        />
      ))}
    </div>
  );
}
