import type {
    SectionData,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import { TemplateForm } from '@/Modules/ContentManagement/features/page-management/section/template';

interface TemplateDataFormProps {
  template: TemplateDefinitionDto;
  templateData: SectionData;
  onTemplateDataChange: (value: SectionData) => void;
}

export function TemplateDataForm({
  template,
  templateData,
  onTemplateDataChange,
}: TemplateDataFormProps) {
  return (
    <div className="bg-muted/40 rounded-md border p-4">
      <TemplateForm
        template={template}
        value={templateData}
        onChange={onTemplateDataChange}
      />
    </div>
  );
}
