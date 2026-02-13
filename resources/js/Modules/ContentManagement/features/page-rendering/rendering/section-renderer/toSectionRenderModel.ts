import type { PageSectionDto } from '@/Modules/ContentManagement/types';
import type { SectionRenderModel } from '../../types';

export function toSectionRenderModel(section: PageSectionDto): SectionRenderModel {
  return {
    id: section.id,
    anchor: section.anchor,
    templateKey: section.template_key,
  };
}
