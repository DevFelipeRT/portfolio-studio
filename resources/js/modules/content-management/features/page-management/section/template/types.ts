import type {
  SectionDataValue,
  TemplateFieldDto,
} from '@/modules/content-management/types';

export interface TemplateFieldControlProps {
  field: TemplateFieldDto;
  value: SectionDataValue | undefined;
  onChange: (value: SectionDataValue) => void;
}
