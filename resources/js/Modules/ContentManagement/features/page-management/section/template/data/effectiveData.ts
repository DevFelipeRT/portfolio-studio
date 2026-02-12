import type {
  SectionData,
  TemplateData,
  TemplateDefinitionDto,
} from '@/Modules/ContentManagement/types';
import { resolveDefaultData } from './defaultData';

export function resolveEffectiveData(
  template: TemplateDefinitionDto,
  sourceData?: SectionData | null,
): TemplateData {
  const defaults = resolveDefaultData(template);

  if (!sourceData) {
    return defaults;
  }

  const next: Partial<TemplateData> = { ...defaults };

  for (const field of template.fields) {
    if (Object.prototype.hasOwnProperty.call(sourceData, field.name)) {
      next[field.name] = sourceData[field.name];
    }
  }

  return next as TemplateData;
}
