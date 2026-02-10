import type {
  SectionDataValue,
  TemplateFieldDto,
} from '@/Modules/ContentManagement/types';

export interface TemplateFieldControlProps {
  field: TemplateFieldDto;
  value: SectionDataValue | undefined;
  onChange: (value: SectionDataValue) => void;
}
