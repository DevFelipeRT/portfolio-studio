import type {
    SectionData,
    TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import { TemplateSectionForm } from '@/Modules/ContentManagement/features/page-management/section/template';

interface TemplateDataFormProps {
  template: TemplateDefinitionDto;
  data: SectionData;
  onDataChange: (value: SectionData) => void;
}

export function TemplateDataForm({
  template,
  data,
  onDataChange,
}: TemplateDataFormProps) {
  return (
    <div className="bg-muted/40 rounded-md border p-4">
      <TemplateSectionForm
        template={template}
        value={data}
        onChange={onDataChange}
      />
    </div>
  );
}
